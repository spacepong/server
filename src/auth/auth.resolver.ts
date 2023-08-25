import { Resolver, Mutation, Args } from '@nestjs/graphql';

import { Auth } from './entities/auth.entity';
import { AuthService } from './auth.service';
import { User } from 'src/user/entities/user.entity';
import { ForbiddenException } from '@nestjs/common';

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
   * @param {AuthService} authService - The authentication service used for resolving authentication-related queries and mutations.
   */
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Auth, {
    name: 'turnOn2fa',
    description: 'Turns on 2FA for the current user',
  })
  async turnOn2fa(
    @Args('userId', { type: () => String }) userId: string,
    @Args('token', { type: () => String }) token: string,
  ): Promise<User> {
    const isTokenValid: boolean = await this.authService.verify2faToken(
      userId,
      token,
    );

    if (!isTokenValid)
      throw new ForbiddenException('Wrong authentication token');

    return this.authService.turnOn2fa(userId);
  }

  @Mutation(() => Auth, {
    name: 'turnOff2fa',
    description: 'Turns off 2FA for the current user',
  })
  async turnOff2fa(
    @Args('userId', { type: () => String }) userId: string,
    @Args('token', { type: () => String }) token: string,
  ): Promise<User> {
    const isTokenValid: boolean = await this.authService.verify2faToken(
      userId,
      token,
    );

    if (!isTokenValid)
      throw new ForbiddenException('Wrong authentication token');

    return this.authService.turnOff2fa(userId);
  }

  @Mutation(() => Auth, {
    name: 'verify2fa',
    description: 'Verifies a 2FA token for the current user',
  })
  async verify2fa(
    @Args('userId', { type: () => String }) userId: string,
    @Args('token', { type: () => String }) token: string,
  ): Promise<boolean> {
    return this.authService.verify2faToken(userId, token);
  }
}
