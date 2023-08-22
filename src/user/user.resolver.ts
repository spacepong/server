import { Args, Query, Resolver } from '@nestjs/graphql';

import { User } from './entities/user.entity';
import { UserService } from './user.service';

/**
 * Resolver for handling User-related GraphQL queries.
 *
 * @export
 * @class UserResolver
 */
@Resolver(() => User)
export class UserResolver {
  /**
   * Creates an instance of the UserResolver class.
   *
   * @param {UserService} userService - The user service used for resolving user-related queries.
   */
  constructor(private readonly userService: UserService) {}

  /**
   * Query to fetch all users.
   *
   * @returns {Promise<User[]>} A list of user entities.
   */
  @Query(() => [User], { name: 'getAllUsers', description: 'Get all users' })
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  /**
   * Query to fetch a user by their ID.
   *
   * @param {string} id - The ID of the user.
   * @returns {Promise<User>} The user entity.
   */
  @Query(() => User, { name: 'getUserById', description: 'Get a user by ID' })
  getUserById(@Args('id', { type: () => String }) id: string): Promise<User> {
    return this.userService.getUserById(id);
  }
}
