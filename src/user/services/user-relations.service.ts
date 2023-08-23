import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { userIncludes } from 'src/includes/user.includes';

@Injectable()
export class UserRelationsService {
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
    if (userId === followId)
      throw new ForbiddenException('Cannot follow yourself');

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

    const isAlreadyFollowing: boolean = user.following.some(
      (followedUser: string) => followedUser === followId,
    );

    if (!isAlreadyFollowing) {
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
    if (userId === unfollowId)
      throw new ForbiddenException('Cannot unfollow yourself');

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
              (followedUser) => followedUser !== unfollowId,
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
    if (userId === blockId)
      throw new ForbiddenException('Cannot block yourself');

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

    const isAlreadyBlocked: boolean = user.blocked.some(
      (blockedUser: string) => blockedUser === blockId,
    );

    if (!isAlreadyBlocked) {
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
              (blockedUser) => blockedUser !== unblockId,
            ),
          },
        },
        include: userIncludes,
      });
    } else return user;
  }
}
