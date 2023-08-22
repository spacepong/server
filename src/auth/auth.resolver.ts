import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';

import { Auth } from './entities/auth.entity';
import { AuthService } from './auth.service';

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

  @Query(() => [Auth], { name: 'auth' })
  findAll() {
    return this.authService.findAll();
  }

  @Query(() => Auth, { name: 'auth' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.authService.findOne(id);
  }

  @Mutation(() => Auth)
  updateAuth(@Args('id', { type: () => Int }) id: number) {
    return this.authService.update(id);
  }

  @Mutation(() => Auth)
  removeAuth(@Args('id', { type: () => Int }) id: number) {
    return this.authService.remove(id);
  }
}
