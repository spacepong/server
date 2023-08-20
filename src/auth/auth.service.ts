// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JwtService } from '@nestjs/jwt';
import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { registerEnumType } from '@nestjs/graphql';

import * as argon from 'argon2';

import { Status } from 'src/user/enums/status.enum';
import { SignUpInput } from './dto/signup.input';
import { SignResponse } from './dto/sign.response';
import { NewTokensResponse } from './dto/new-tokens.response';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConnectionService } from 'src/connection/connection.service';

registerEnumType(Status, {
  name: 'Status',
  description: 'The status of the user',
});

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
   */
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private JwtService: JwtService,
    private connectionService: ConnectionService,
  ) {}

  /**
   * Creates a new user account through the signup process.
   *
   * @param {SignUpInput} signUpInput - Input data for user signup.
   * @returns {Promise<SignResponse>} - Access and refresh tokens and user data.
   * @throws {ConflictException} If a user with the provided username or email already exists.
   */
  async signup(signUpInput: SignUpInput): Promise<SignResponse> {
    await this.prisma.user
      .findFirst({
        where: {
          OR: [
            { username: signUpInput.username },
            { connection: { email: signUpInput.email } },
          ],
        },
      })
      .then((user) => {
        if (user)
          throw new ConflictException(
            'A user with this username or email already exists.',
          );
      });
    return {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      user: {
        id: 'id',
        username: '',
        profileComplete: false,
        rank: 0,
        status: Status.ONLINE,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  /**
   * Creates access and refresh tokens for the provided user ID and email.
   *
   * @param {number} userId - User ID.
   * @param {string} email - User's email.
   * @returns {Promise<NewTokensResponse>} - Access and refresh tokens.
   */
  async createTokens(
    userId: number,
    email: string,
  ): Promise<NewTokensResponse> {
    // Generate an access token
    const accessToken: string = this.JwtService.sign(
      { userId, email },
      {
        expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      },
    );

    // Generate a refresh token tied to the access token
    const refreshToken: string = this.JwtService.sign(
      { userId, email, accessToken },
      {
        expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      },
    );

    // Return both tokens
    return { accessToken, refreshToken };
  }

  /**
   * Updates the refresh token for the provided user ID.
   *
   * @param {number} userId - User ID.
   * @param {string} refreshToken - New refresh token.
   * @returns {Promise<void>}
   */
  async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    // Hash the new refresh token using argon2
    const hashedRefreshToken: string = await argon.hash(refreshToken);
    console.log(hashedRefreshToken);
  }
}
