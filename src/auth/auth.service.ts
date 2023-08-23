// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JwtService } from '@nestjs/jwt';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as crypto from 'crypto';

import { User } from 'src/user/entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewAccessTokenResponse } from './dto/new-access-token.response';
import { SignResponse } from './dto/sign.response';
import { userIncludes } from 'src/includes/user.includes';
import { UserService } from 'src/user/user.service';

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
      ).then((response: NewAccessTokenResponse) => response.accessToken),
      intra42AccessToken: signInInput.accessToken,
      intra42RefreshToken: signInInput.refreshToken,
      user,
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
   * @returns {Promise<NewAccessTokenResponse>} - The user's access token.
   */
  async createAccessToken(
    userId: string,
    intra42AccessToken: string,
  ): Promise<NewAccessTokenResponse> {
    /**
     * Create a new access token for the user.
     * The access token is signed using the JWT_ACCESS_TOKEN_SECRET environment variable.
     * The algorithm used is HS256.
     * The payload contains the user ID and the Intra42 access token.
     */
    return {
      accessToken: this.JwtService.sign(
        { userId, intra42AccessToken },
        {
          algorithm: 'HS256',
          secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        },
      ),
    };
  }
}
