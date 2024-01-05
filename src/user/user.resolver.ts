import { ForbiddenException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { DEBUG } from 'src/constants';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { CurrentUserId } from 'src/auth/decorators/current-userid.decorator';
import { UserRelationsService } from './services/user-relations.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

/**
 * Resolver for handling User-related GraphQL queries.
 *
 * @export
 * @class UserResolver
 * @module user
 */
@Resolver(() => User)
export class UserResolver {
  /**
   * Creates an instance of the UserResolver class.
   *
   * @param {UserService} userService - The user service used for resolving user-related queries.
   * @param {UserRelationsService} userRelationsService - The user relations service used for resolving user-related queries.
   */
  constructor(
    private readonly userService: UserService,
    private readonly userRelationsService: UserRelationsService,
  ) {}

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
   * @param {string[]} userIds - The IDs of the users.
   * @returns {Promise<User[]>} The user entities.
   */
  @Query(() => [User], {
    name: 'populateUserIds',
    description: 'Retrieves a list of users by their IDs',
  })
  populateUserIds(
    @Args('userIds', { type: () => [String] }) userIds: string[],
  ): Promise<User[]> {
    return this.userService.populateUserIds(userIds);
  }

  /**
   * Mutation to update the username of a user.
   *
   * @param {string} id - The ID of the user making the request.
   * @param {string} userId - The ID of the user.
   * @param {string} username - The new username of the user.
   * @returns {Promise<User>} The updated user entity.
   * @throws {ForbiddenException} If the username cannot be updated.
   */
  @Mutation(() => User, {
    name: 'updateUsername',
    description: 'Updates the username of a user',
  })
  updateUsername(
    @CurrentUserId() id: string,
    @Args('userId', { type: () => String }) userId: string,
    @Args('username', { type: () => String }) username: string,
  ): Promise<User> {
    if (id !== userId && !DEBUG)
      throw new ForbiddenException('User not authorized');
    return this.userService.updateUsername(userId, username);
  }

  /**
   * Mutation to update the avatar of a user.
   *
   * @param {string} id - The ID of the user making the request.
   * @param {string} userId - The ID of the user.
   * @param {string} avatar - The new avatar of the user.
   * @returns {Promise<User>} The updated user entity.
   * @throws {ForbiddenException} If the avatar cannot be updated.
   */
  @Mutation(() => User, {
    name: 'updateAvatar',
    description: 'Updates the avatar of a user',
  })
  updateAvatar(
    @CurrentUserId() id: string,
    @Args('userId', { type: () => String }) userId: string,
    @Args('avatar', { type: () => String }) avatar: string,
  ): Promise<User> {
    if (id !== userId && !DEBUG)
      throw new ForbiddenException('User not authorized');
    return this.userService.updateAvatar(userId, avatar);
  }

  /**
   * Mutation to delete a user.
   *
   * @param {string} id - The ID of the user making the request.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<User>} The deleted user entity.
   * @throws {ForbiddenException} If the user cannot be deleted.
   */
  @Mutation(() => User, {
    name: 'deleteUser',
    description: 'Deletes a user',
  })
  deleteUser(
    @CurrentUserId() id: string,
    @Args('userId', { type: () => String }) userId: string,
  ): Promise<User> {
    if (id !== userId && !DEBUG)
      throw new ForbiddenException('User not authorized');
    return this.userService.deleteUser(userId);
  }

  /**
   * Mutation to follow a user.
   *
   * @param {string} id - The ID of the user making the request.
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
    @CurrentUserId() id: string,
    @Args('userId', { type: () => String }) userId: string,
    @Args('followId', { type: () => String }) followId: string,
  ): Promise<User> {
    if (id !== userId && !DEBUG)
      throw new ForbiddenException('User not authorized');
    return this.userRelationsService.followUser(userId, followId);
  }

  /**
   * Mutation to unfollow a user.
   *
   * @param {string} id - The ID of the user making the request.
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
    @CurrentUserId() id: string,
    @Args('userId', { type: () => String }) userId: string,
    @Args('unfollowId', { type: () => String }) unfollowId: string,
  ): Promise<User> {
    if (id !== userId && !DEBUG)
      throw new ForbiddenException('User not authorized');
    return this.userRelationsService.unfollowUser(userId, unfollowId);
  }

  /**
   * Mutation to block a user.
   *
   * @param {string} id - The ID of the user making the request.
   * @param {string} userId - The ID of the user.
   * @param {string} blockId - The ID of the user to block.
   * @returns {Promise<User>} The updated user entity.
   * @throws {ForbiddenException} If the user tries to block themselves.
   * @throws {NotFoundException} If the user or the user to block is not found.
   */
  @Mutation(() => User, {
    name: 'blockUser',
    description: 'Blocks a user',
  })
  blockUser(
    @CurrentUserId() id: string,
    @Args('userId', { type: () => String }) userId: string,
    @Args('blockId', { type: () => String }) blockId: string,
  ): Promise<User> {
    if (id !== userId && !DEBUG)
      throw new ForbiddenException('User not authorized');
    return this.userRelationsService.blockUser(userId, blockId);
  }

  /**
   * Mutation to unblock a user.
   *
   * @param {string} id - The ID of the user making the request.
   * @param {string} userId - The ID of the user.
   * @param {string} unblockId - The ID of the user to unblock.
   * @returns {Promise<User>} The updated user entity.
   * @throws {ForbiddenException} If the user tries to unblock themselves.
   * @throws {NotFoundException} If the user or the user to unblock is not found.
   */
  @Mutation(() => User, {
    name: 'unblockUser',
    description: 'Unblocks a user',
  })
  unblockUser(
    @CurrentUserId() id: string,
    @Args('userId', { type: () => String }) userId: string,
    @Args('unblockId', { type: () => String }) unblockId: string,
  ): Promise<User> {
    if (id !== userId && !DEBUG)
      throw new ForbiddenException('User not authorized');
    return this.userRelationsService.unblockUser(userId, unblockId);
  }

  /**
   * Mutation to delete all users (development environment only).
   *
   * @param {boolean} isAdmin - Whether or not the user is an admin.
   * @returns {string} A message indicating that all users were deleted.
   * @throws {ForbiddenException} If attempted to delete users outside of the development environment.
   */
  @Mutation(() => String, {
    name: 'deleteAllUsers',
    description: 'Deletes all users in development environment',
  })
  deleteAllUsers(@CurrentUser('isAdmin') isAdmin: boolean): string {
    if (DEBUG && isAdmin) this.userService.deleteAllUsers();
    else throw new ForbiddenException('User not authorized');
    return 'All users deleted';
  }
}
