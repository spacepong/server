import { ForbiddenException, Injectable } from '@nestjs/common';

import { User } from './entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { userIncludes } from 'src/includes/user.includes';

/**
 * Service for managing User-related operations.
 *
 * @export
 * @class UserService
 */
@Injectable()
export class UserService {
  /**
   * Creates an instance of the UserService class.
   *
   * @param {PrismaService} prisma - The Prisma service for database interactions.
   */
  constructor(private prisma: PrismaService) {}

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
    if (!user) throw new ForbiddenException('User not found');
    return user;
  }
}
