import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { userIncludes } from 'src/includes/user.includes';

/**
 * Service for managing User-related operations.
 *
 * @export
 * @class UserRelationsService
 * @module user
 */
@Injectable()
export class UserRelationsService {
  /**
   * Creates an instance of the UserRelationsService class.
   *
   * @param {PrismaService} prisma - The Prisma service for database interactions.
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Follows a user.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} followId - The ID of the user to follow.
   * @returns {Promise<User>} A promise that resolves to the updated user.
   * @throws {ForbiddenException} If the user tries to follow themselves.
   * @throws {NotFoundException} If the user or the user to follow is not found.
   */
  async followUser(userId: string, followId: string): Promise<User> {
    /**
     * Check if the user is trying to follow themselves.
     * If they are, throw a ForbiddenException.
     */
    if (userId === followId)
      throw new ForbiddenException('Cannot follow yourself');

    /**
     * Find the user and the user to follow.
     * If either of them is not found, throw a NotFoundException.
     */
    const user: User = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: userIncludes,
    });
    const toFollow: User = await this.prisma.user.findUnique({
      where: {
        id: followId,
      },
    });

    if (!user || !toFollow) throw new NotFoundException('User not found');

    /**
     * Check if the user is already following the user to follow.
     * If they are, return the user unchanged.
     * If they aren't, update the user and return the updated user.
     */
    const isAlreadyFollowing: boolean = user.following.some(
      (followedUser: string) => followedUser === followId,
    );

    if (!isAlreadyFollowing) {
      /**
       * Check if the user is blocked by the user to follow.
       * If they are, throw a ForbiddenException.
       */
      const isBlocked: boolean = toFollow.blocked.some(
        (blockedUser: string) => blockedUser === userId,
      );

      if (isBlocked)
        throw new ForbiddenException('Cannot follow a user who blocked you');

      /**
       * Check if the user to follow is blocked by the user.
       * If they are, throw a ForbiddenException.
       */
      const isBlockedByUser: boolean = user.blocked.some(
        (blockedUser: string) => blockedUser === followId,
      );

      if (isBlockedByUser)
        throw new ForbiddenException('Cannot follow a user you blocked');

      return this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          following: {
            push: followId,
          },
        },
        include: userIncludes,
      });
    } else return user;
  }

  /**
   * Unfollows a user.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} unfollowId - The ID of the user to unfollow.
   * @returns {Promise<User>} A promise that resolves to the updated user.
   * @throws {ForbiddenException} If the user tries to unfollow themselves.
   * @throws {NotFoundException} If the user or the user to unfollow is not found.
   */
  async unfollowUser(userId: string, unfollowId: string): Promise<User> {
    /**
     * Check if the user is trying to unfollow themselves.
     * If they are, throw a ForbiddenException.
     */
    if (userId === unfollowId)
      throw new ForbiddenException('Cannot unfollow yourself');

    /**
     * Find the user and the user to unfollow.
     * If either of them is not found, throw a NotFoundException.
     */
    const user: User = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: userIncludes,
    });
    const toUnfollow: User = await this.prisma.user.findUnique({
      where: {
        id: unfollowId,
      },
    });

    if (!user || !toUnfollow) throw new NotFoundException('User not found');

    /**
     * Check if the user is already following the user to unfollow.
     * If they are, update the user and return the updated user.
     * If they aren't, return the user unchanged.
     */
    const isAlreadyFollowing: boolean = user.following.some(
      (followedUser: string) => followedUser === unfollowId,
    );

    if (isAlreadyFollowing) {
      return this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          following: {
            set: user.following.filter(
              (followedUser: string) => followedUser !== unfollowId,
            ),
          },
        },
        include: userIncludes,
      });
    } else return user;
  }

  /**
   * Block a user.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} blockId - The ID of the user to block.
   * @returns {Promise<User>} A promise that resolves to the updated user.
   * @throws {ForbiddenException} If the user tries to block themselves.
   * @throws {NotFoundException} If the user or the user to block is not found.
   */
  async blockUser(userId: string, blockId: string): Promise<User> {
    /**
     * Check if the user is trying to block themselves.
     * If they are, throw a ForbiddenException.
     */
    if (userId === blockId)
      throw new ForbiddenException('Cannot block yourself');

    /**
     * Find the user and the user to block.
     * If either of them is not found, throw a NotFoundException.
     */
    const user: User = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: userIncludes,
    });
    const toBlock: User = await this.prisma.user.findUnique({
      where: {
        id: blockId,
      },
    });

    if (!user || !toBlock) throw new NotFoundException('User not found');

    /**
     * Check if the user is already blocked.
     * If they are, return the user unchanged.
     * If they aren't, update the user and return the updated user.
     */
    const isAlreadyBlocked: boolean = user.blocked.some(
      (blockedUser: string) => blockedUser === blockId,
    );

    if (!isAlreadyBlocked) {
      /**
       * Check if the user is following the user to block.
       * If they are, unfollow the user to block.
       */
      if (
        user.following.some((followedUser: string) => followedUser === blockId)
      )
        await this.unfollowUser(userId, blockId);

      /**
       * Check if the user to block is following the user.
       * If they are, unfollow the user.
       */
      if (
        toBlock.following.some(
          (followedUser: string) => followedUser === userId,
        )
      )
        await this.unfollowUser(blockId, userId);

      return this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          blocked: {
            push: blockId,
          },
        },
        include: userIncludes,
      });
    } else return user;
  }

  /**
   * Unblock a user.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} unblockId - The ID of the user to unblock.
   * @returns {Promise<User>} A promise that resolves to the updated user.
   * @throws {ForbiddenException} If the user tries to unblock themselves.
   * @throws {NotFoundException} If the user or the user to unblock is not found.
   */
  async unblockUser(userId: string, unblockId: string): Promise<User> {
    if (userId === unblockId)
      throw new ForbiddenException('Cannot unblock yourself');

    const user: User = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: userIncludes,
    });
    const toUnblock: User = await this.prisma.user.findUnique({
      where: {
        id: unblockId,
      },
    });

    if (!user || !toUnblock) throw new NotFoundException('User not found');

    const isAlreadyBlocked: boolean = user.blocked.some(
      (blockedUser: string) => blockedUser === unblockId,
    );

    if (isAlreadyBlocked) {
      return this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          blocked: {
            set: user.blocked.filter(
              (blockedUser: string) => blockedUser !== unblockId,
            ),
          },
        },
        include: userIncludes,
      });
    } else return user;
  }
}
