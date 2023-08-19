// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { registerEnumType } from '@nestjs/graphql';

import { UpdateAuthInput } from './dto/update-auth.input';
import { SignUpInput } from './dto/signup.input';
import { SignResponse } from './dto/sign.response';
import { NewTokensResponse } from './dto/new-tokens.response';
import { Status } from 'src/user/enums/status.enum';

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
   * @param {ConfigService} configService - The configuration service for accessing application configuration.
   */
  constructor(
    private configService: ConfigService,
    private JwtService: JwtService,
  ) {}

  /**
   * Creates a new user account through the signup process.
   *
   * @param {SignUpInput} signUpInput - Input data for user signup.
   * @returns {Promise<SignResponse>} - Access and refresh tokens and user data.
   * @throws {ConflictException} If a user with the provided username or email already exists.
   */
  async signup(signUpInput: SignUpInput): Promise<SignResponse> {
    signUpInput;
    return {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      user: {
        id: 1,
        username: 'username',
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

  update(id: number, updateAuthInput: UpdateAuthInput) {
    updateAuthInput;
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
}
