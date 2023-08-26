import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ForbiddenException } from '@nestjs/common';

import { Auth } from './entities/auth.entity';
import { Auth2faService } from './services/auth-2fa.service';

/**
 * Resolver class for handling GraphQL queries and mutations related to authentication.
 *
 * @export
 * @class AuthResolver
 */
@Resolver(() => Auth)
export class AuthResolver {
  /**
   * Creates an instance of the AuthResolver class.
   *
   * @param {Auth2faService} auth2faService - The service responsible for two-factor authentication (2FA) related functionality.
   */
  constructor(private readonly auth2faService: Auth2faService) {}

  /**
   * Mutation for generating a 2FA token for the current user.
   *
   * @param {string} userId - User ID.
   * @param {string} username - Username of the user.
   * @returns {Promise<Auth>} - The generated 2FA token and OTP authentication URL.
   */
  @Mutation(() => Auth, {
    name: 'generate2faToken',
    description: 'Generates a 2FA token for the current user',
  })
  async generate2faToken(
    @Args('userId', { type: () => String }) userId: string,
    @Args('username', { type: () => String }) username: string,
  ): Promise<Auth> {
    const { otpAuthUrl } = await this.auth2faService.generate2faSecret(
      userId,
      username,
    );
    return {
      status: '2FA token generated',
      otpAuthUrl: await this.auth2faService.generateQrCodeDataURL(otpAuthUrl),
    };
  }

  /**
   * Mutation for turning on two-factor authentication (2FA) for the current user.
   *
   * @param {string} userId - User ID.
   * @param {string} token - Authentication token for verifying 2FA setup.
   * @returns {Promise<Auth>} - The status and updated user information.
   * @throws {ForbiddenException} - If the provided token is invalid.
   */
  @Mutation(() => Auth, {
    name: 'turnOn2fa',
    description: 'Turns on 2FA for the current user',
  })
  async turnOn2fa(
    @Args('userId', { type: () => String }) userId: string,
    @Args('token', { type: () => String }) token: string,
  ): Promise<Auth> {
    const isTokenValid: boolean = await this.auth2faService.verify2faToken(
      userId,
      token,
    );

    if (!isTokenValid)
      throw new ForbiddenException('Wrong authentication token');

    return {
      status: '2FA turned on',
      user: await this.auth2faService.turnOn2fa(userId),
    };
  }

  /**
   * Mutation for turning off two-factor authentication (2FA) for the current user.
   *
   * @param {string} userId - User ID.
   * @param {string} token - Authentication token for verifying 2FA removal.
   * @returns {Promise<Auth>} - The status and updated user information.
   * @throws {ForbiddenException} - If the provided token is invalid.
   */
  @Mutation(() => Auth, {
    name: 'turnOff2fa',
    description: 'Turns off 2FA for the current user',
  })
  async turnOff2fa(
    @Args('userId', { type: () => String }) userId: string,
    @Args('token', { type: () => String }) token: string,
  ): Promise<Auth> {
    const isTokenValid: boolean = await this.auth2faService.verify2faToken(
      userId,
      token,
    );

    if (!isTokenValid)
      throw new ForbiddenException('Wrong authentication token');

    return {
      status: '2FA turned off',
      user: await this.auth2faService.turnOff2fa(userId),
    };
  }

  /**
   * Mutation for verifying a two-factor authentication (2FA) token for the current user.
   *
   * @param {string} userId - User ID.
   * @param {string} token - 2FA token to verify.
   * @returns {Promise<Auth>} - The status and whether the 2FA token is valid.
   */
  @Mutation(() => Auth, {
    name: 'verify2fa',
    description: 'Verifies a 2FA token for the current user',
  })
  async verify2fa(
    @Args('userId', { type: () => String }) userId: string,
    @Args('token', { type: () => String }) token: string,
  ): Promise<Auth> {
    return {
      status: '2FA token verified',
      is2faValid: await this.auth2faService.verify2faToken(userId, token),
    };
  }
}
