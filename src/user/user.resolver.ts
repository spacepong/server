import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

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
  @Query(() => [User], {
    name: 'getAllUsers',
    description: 'Retrieves all users with their associated data',
  })
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  /**
   * Query to fetch a user by their ID.
   *
   * @param {string} id - The ID of the user.
   * @returns {Promise<User>} The user entity.
   */
  @Query(() => User, {
    name: 'getUserById',
    description: 'Retrieves a user by their ID with associated data',
  })
  getUserById(@Args('id', { type: () => String }) id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  /**
   * Query to fetch a list of users by their IDs.
   *
   * @param {string[]} ids - The IDs of the users.
   * @returns {Promise<User[]>} The user entities.
   */
  @Query(() => [User], {
    name: 'populateIds',
    description: 'Retrieves a list of users by their IDs',
  })
  populateIds(
    @Args('ids', { type: () => [String] }) ids: string[],
  ): Promise<User[]> {
    return this.userService.populateIds(ids);
  }

  /**
   * Mutation to update the username of a user.
   *
   * @param {string} id - The ID of the user.
   * @param {string} username - The new username of the user.
   * @returns {Promise<User>} The updated user entity.
   * @throws {ForbiddenException} If the username cannot be updated.
   */
  @Mutation(() => User, {
    name: 'updateUsername',
    description: 'Updates the username of a user',
  })
  updateUsername(
    @Args('id', { type: () => String }) id: string,
    @Args('username', { type: () => String }) username: string,
  ): Promise<User> {
    return this.userService.updateUsername(id, username);
  }

  /**
   * Mutation to follow a user.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} followId - The ID of the user to follow.
   * @returns {Promise<User>} The updated user entity.
   * @throws {ForbiddenException} If the user tries to follow themselves.
   * @throws {NotFoundException} If the user or the user to follow is not found.
   */
  @Mutation(() => User, {
    name: 'followUser',
    description: 'Follows a user',
  })
  followUser(
    @Args('userId', { type: () => String }) userId: string,
    @Args('followId', { type: () => String }) followId: string,
  ): Promise<User> {
    return this.userService.followUser(userId, followId);
  }

  /**
   * Mutation to unfollow a user.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} unfollowId - The ID of the user to unfollow.
   * @returns {Promise<User>} The updated user entity.
   * @throws {ForbiddenException} If the user tries to unfollow themselves.
   * @throws {NotFoundException} If the user or the user to unfollow is not found.
   */
  @Mutation(() => User, {
    name: 'unfollowUser',
    description: 'Unfollows a user',
  })
  unfollowUser(
    @Args('userId', { type: () => String }) userId: string,
    @Args('unfollowId', { type: () => String }) unfollowId: string,
  ): Promise<User> {
    return this.userService.unfollowUser(userId, unfollowId);
  }
}
