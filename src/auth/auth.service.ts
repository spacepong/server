// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JwtService } from '@nestjs/jwt';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

import * as crypto from 'crypto';

import { User } from 'src/user/entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewAccessTokenResponse } from './dto/new-access-token.response';
import { SignResponse } from './dto/sign.response';
import { userIncludes } from 'src/includes/user.includes';
import { UserService } from 'src/user/user.service';
import { SignIn2faInput } from './dto/signin-2fa.input';

/**
 * Service responsible for authentication-related functionality.
 *
 * @export
 * @class AuthService
 */
@Injectable()
export class AuthService {
  /**
   * Creates an instance of the AuthService class.
   *
   * @param {PrismaService} prisma - The Prisma service for database interactions.
   * @param {ConfigService} configService - The configuration service for accessing application configuration.
   * @param {JwtService} JwtService - The JWT service for generating and verifying tokens.
   * @param {UserService} userService - The user service for interacting with user-related data.
   */
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private JwtService: JwtService,
    private userService: UserService,
  ) {}

  /**
   * Handles the user sign-in process.
   *
   * @param {any} signInInput - The sign-in input data.
   * @returns {Promise<SignResponse>} - The sign-in response including access tokens and user data.
   */
  async signin(signInInput: any): Promise<SignResponse> {
    let user: User = null;

    /**
     * Try to find a user with the provided Intra42 ID.
     * If no user is found, try to create a new user with the provided Intra42 username.
     * If that fails, try to create a new user with the provided Intra42 username and a random number appended to it.
     * If that fails, throw an error.
     */
    try {
      user = await this.prisma.user.findFirst({
        where: {
          connection: {
            intra_42: signInInput.profile._json.id,
          },
        },
        include: userIncludes,
      });
    } catch (e) {}
    try {
      if (!user)
        user = await this.userService.createUser(
          signInInput,
          signInInput.profile.username,
        );
    } catch (e) {}
    try {
      if (!user)
        user = await this.userService.createUser(
          signInInput,
          `${signInInput.profile.username}_${
            crypto.randomBytes(2).readUInt16BE(0) % 10000
          }`,
        );
    } catch (e) {}
    if (!user)
      throw new InternalServerErrorException('Unable to retrieve user');

    /**
     * Create a new access token for the user.
     * Return the access token and the user data.
     */
    return {
      accessToken: await this.createAccessToken(
        user.id,
        signInInput.accessToken,
        user.connection.is2faEnabled,
      ).then((response: NewAccessTokenResponse) => response.accessToken),
      intra42AccessToken: signInInput.accessToken,
      intra42RefreshToken: signInInput.refreshToken,
      user,
    };
  }

  /**
   * Handles the user sign-in process with 2FA.
   *
   * @param {SignIn2faInput} signInInput - The sign-in input data.
   * @returns {Promise<SignResponse>} - The sign-in response including access tokens and user data.
   */
  async signin2fa(signInInput: SignIn2faInput): Promise<SignResponse> {
    let user: User = null;
    try {
      user = await this.prisma.user.findFirst({
        where: {
          id: signInInput.userId,
        },
        include: userIncludes,
      });
    } catch (e) {}

    if (!user)
      throw new InternalServerErrorException('Unable to retrieve user');

    return {
      accessToken: await this.createAccessToken(
        user.id,
        signInInput.intra42AccessToken,
        user.connection.is2faEnabled,
        true,
      ).then((response: NewAccessTokenResponse) => response.accessToken),
      intra42AccessToken: signInInput.intra42AccessToken,
      intra42RefreshToken: signInInput.intra42RefreshToken,
      user: user,
    };
  }

  /**
   * Fetches all auth records.
   *
   * @returns {string} - A message indicating that this action returns all auth.
   */
  findAll(): string {
    return `This action returns all auth`;
  }

  /**
   * Updates an auth record by ID.
   *
   * @param {number} id - The ID of the auth record to update.
   * @returns {string} - A message indicating that this action updates an auth record.
   */
  update(id: number): string {
    return `This action updates a #${id} auth`;
  }

  /**
   * Creates an access token for the provided user ID and Intra42 access token.
   *
   * @param {string} userId - User ID.
   * @param {string} intra42AccessToken - Intra42 access token.
   * @param {boolean} is2faEnabled - Whether or not 2FA is enabled for the user.
   * @param {boolean} is2faAuthenticated - Whether or not 2FA is authenticated for the user.
   * @returns {Promise<NewAccessTokenResponse>} - The user's access token.
   */
  async createAccessToken(
    userId: string,
    intra42AccessToken: string,
    is2faEnabled: boolean = false,
    is2faAuthenticated: boolean = false,
  ): Promise<NewAccessTokenResponse> {
    /**
     * Create a new access token for the user.
     * The access token is signed using the JWT_ACCESS_TOKEN_SECRET environment variable.
     * The algorithm used is HS256.
     * The payload contains the user ID and the Intra42 access token.
     */
    return {
      accessToken: this.JwtService.sign(
        { userId, intra42AccessToken, is2faEnabled, is2faAuthenticated },
        {
          algorithm: 'HS256',
          secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        },
      ),
    };
  }

  async generate2faSecret(
    userId: string,
    username: string,
  ): Promise<{ secret: string; otpAuthUrl: string }> {
    const secret: string = authenticator.generateSecret();
    const otpAuthUrl: string = authenticator.keyuri(
      username,
      this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'),
      secret,
    );
    await this.set2faSecret(userId, secret);
    return { secret, otpAuthUrl };
  }

  async set2faSecret(userId: string, secret: string): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        connection: {
          update: {
            otp: secret,
            otpCreatedAt: new Date(),
          },
        },
      },
      include: userIncludes,
    });
  }

  async generateQrCodeDataURL(otpAuthUrl: string): Promise<string> {
    return toDataURL(otpAuthUrl);
  }

  async turnOn2fa(userId: string): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        connection: {
          update: {
            is2faEnabled: true,
          },
        },
      },
      include: userIncludes,
    });
  }

  async turnOff2fa(userId: string): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        connection: {
          update: {
            otp: null,
            otpCreatedAt: null,
            is2faEnabled: false,
          },
        },
      },
      include: userIncludes,
    });
  }

  async verify2faToken(userId: string, token: string): Promise<boolean> {
    const user: User = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: userIncludes,
    });

    if (!user) return false;

    if (!user.connection.otp)
      throw new ForbiddenException('2FA is not enabled');

    return authenticator.verify({
      token,
      secret: user.connection.otp,
    });
  }
}
