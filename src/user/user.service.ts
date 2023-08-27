import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { User } from './entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { userIncludes } from 'src/includes/user.includes';

/**
 * Service for managing User-related operations.
 *
 * @export
 * @class UserService
 * @module user
 */
@Injectable()
export class UserService {
  /**
   * Creates an instance of the UserService class.
   *
   * @param {PrismaService} prisma - The Prisma service for database interactions.
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves all users with their associated data.
   *
   * @returns {Promise<User[]>} A promise that resolves to an array of users.
   */
  getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: userIncludes,
    });
  }

  /**
   * Retrieves a user by their ID with associated data.
   *
   * @param {string} id - The ID of the user to retrieve.
   * @returns {Promise<User>} A promise that resolves to the requested user.
   * @throws {ForbiddenException} If the user is not found.
   */
  async getUserById(id: string): Promise<User> {
    const user: User = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: userIncludes,
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /**
   * Creates a new user.
   *
   * @param {any} signInInput - The sign-in input data.
   * @param {string} username - The username of the user.
   * @returns {Promise<User>} A promise that resolves to the created user.
   */
  async createUser(signInInput: any, username: string): Promise<User> {
    return this.prisma.user.create({
      data: {
        avatar: {
          create: {
            defaultFilename: signInInput.profile._json.image.link,
            filename: signInInput.profile._json.image.link,
          },
        },
        connection: {
          create: {
            intra_42: signInInput.profile._json.id,
          },
        },
        username,
      },
      include: userIncludes,
    });
  }

  /**
   * Retrieves a list of users by their IDs.
   *
   * @param {string[]} userIds - The IDs of the users to retrieve.
   * @returns {Promise<User[]>} A promise that resolves to the requested users.
   */
  populateUserIds(userIds: string[]): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      include: userIncludes,
    });
  }

  /**
   * Updates the username of a user.
   *
   * @param {string} userId - The ID of the user to update.
   * @param {string} username - The new username of the user.
   * @returns {Promise<User>} A promise that resolves to the updated user.
   * @throws {ForbiddenException} If the username is too short or if the update fails.
   */
  updateUsername(userId: string, username: string): Promise<User> {
    /**
     * Remove all whitespace from the username.
     * This is done to prevent users from having a username that is only whitespace.
     * This is also done to prevent users from having a username that starts or ends with whitespace.
     */
    username = username.replace(/\s+/g, '');
    if (username.length < 3)
      throw new ForbiddenException('Username must be at least 3 characters');

    try {
      return this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          username,
        },
        include: userIncludes,
      });
    } catch (e) {
      throw new ForbiddenException('Unable to update username');
    }
  }

  /**
   * Updates the avatar of a user.
   *
   * @param {string} userId - The ID of the user to update.
   * @param {string} avatar - The new avatar of the user.
   * @returns {Promise<User>} A promise that resolves to the updated user.
   * @throws {ForbiddenException} If the avatar cannot be updated.
   */
  updateAvatar(userId: string, avatar: string): Promise<User> {
    try {
      return this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          avatar: {
            update: {
              filename: avatar,
            },
          },
        },
        include: userIncludes,
      });
    } catch (e) {
      throw new ForbiddenException('Unable to update avatar');
    }
  }

  /**
   * Deletes a user and their associated data.
   *
   * @param {string} userId - The ID of the user to delete.
   * @returns {Promise<User>} A promise that resolves to the deleted user.
   * @throws {ForbiddenException} If the user cannot be deleted.
   */
  async deleteUser(userId: string): Promise<User> {
    try {
      /**
       * Delete the user's avatar and connection before deleting the user.
       * This is done to prevent orphaned data in the database.
       */
      const [deletedAvatarsCount, deletedConnectionsCount, deletedUser] =
        await this.prisma.$transaction([
          this.prisma.avatar.deleteMany({
            where: {
              userId,
            },
          }),
          this.prisma.connection.deleteMany({
            where: {
              userId,
            },
          }),
          this.prisma.user.delete({
            where: {
              id: userId,
            },
            include: userIncludes,
          }),
        ]);

      if (deletedAvatarsCount.count === 0)
        throw new ForbiddenException('Unable to delete user avatar');
      if (deletedConnectionsCount.count === 0)
        throw new ForbiddenException('Unable to delete user connection');

      return deletedUser;
    } catch (e) {
      throw new ForbiddenException('Unable to delete user and associated data');
    }
  }

  /**
   * Deletes all users and their associated data.
   * This is only available in the development environment.
   *
   * @returns {Promise<void>}
   * @throws {ForbiddenException} If attempted to delete users outside of the development environment.
   */
  async deleteAllUsers(): Promise<void> {
    try {
      await this.prisma.$transaction([
        this.prisma.avatar.deleteMany({}),
        this.prisma.connection.deleteMany({}),
        this.prisma.user.deleteMany({}),
      ]);
    } catch (e) {
      throw new ForbiddenException(
        'Unable to delete all users and associated data',
      );
    }
  }
}
