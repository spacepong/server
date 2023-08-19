import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';

import { Auth } from './entities/auth.entity';
import { AuthService } from './auth.service';
import { SignUpInput } from './dto/signup.input';
import { SignResponse } from './dto/sign.response';

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

  /**
   * Mutation to create a new user account by signing up.
   *
   * @param {SignUpInput} signUpInput - User signup input data.
   * @returns {Promise<SignResponse>} - Sign-in response with tokens and user details.
   */
  @Mutation(() => SignResponse, { name: 'signup' })
  signup(@Args('signUpInput') signUpInput: SignUpInput): Promise<SignResponse> {
    // Call the authService's signup method to create a new user
    return this.authService.signup(signUpInput);
  }

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
