import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';

import { User } from 'src/user/entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { Achievement } from './entities/achievement.entity';
import { achievements } from 'src/achievements';
import { UpdateAchievementInput } from './dto/update-achievement.input';
import { userAchievementsDataMapped } from './user-achievement.service';

/**
 * Service responsible for handling achievements-related operations.
 *
 * @export
 * @class AchievementService
 * @implements {OnModuleInit}
 * @module achievement
 */
@Injectable()
export class AchievementService implements OnModuleInit {
  /**
   * Creates an instance of the AchievementService class.
   *
   * @param {PrismaService} prisma - The Prisma service for database interactions.
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * A list of created achievements.
   * @type {Achievement[]}
   */
  private createdAchievements: Achievement[] = [];

  /**
   * Method called when the module is initialized.
   * This is used to create achievements when the application is started.
   *
   * @returns {Promise<void>} A Promise that resolves when the module is initialized.
   */
  async onModuleInit(): Promise<void> {
    await this.createAchievements(true);
  }

  /**
   * Creates achievements by adding them to the database.
   *
   * @returns {Promise<Achievement[]>} A list of created achievements.
   */
  async createAchievements(isSetup: boolean = false): Promise<Achievement[]> {
    /**
     * Creates achievements by adding them to the database.
     * If an achievement already exists, it is skipped.
     * This is done to prevent duplicate achievements from being created.
     */
    await this.prisma.achievement.createMany({
      data: achievements,
      skipDuplicates: true,
    });

    /**
     * Retrieves all achievements from the database.
     * This is done to return the achievements with their IDs.
     */
    this.createdAchievements = await this.getAllAchievements();

    /**
     * If this function isn't called during setup, all users are given the newly created achievements.
     * This is done to prevent orphaned achievements.
     */
    if (!isSetup) await this.refreshUsersAchievements();

    return this.createdAchievements;
  }

  async refreshUsersAchievements(): Promise<Achievement[]> {
    /**
     * Retrieves all users from the database.
     * Then, we determine which user achievements need to be created.
     * This is done by creating a list of user achievement data.
     * This list is then used to create user achievements.
     * If a user achievement already exists, it is skipped.
     */
    const allUsers: User[] = await this.prisma.user.findMany();
    const userAchievements: userAchievementsDataMapped[] = allUsers.flatMap(
      (user: User) =>
        this.createdAchievements.map((achievement: Achievement) => ({
          userId: user.id,
          achievementId: achievement.id,
        })),
    );
    await this.prisma.userAchievement.createMany({
      data: userAchievements,
      skipDuplicates: true,
    });

    /**
     * Retrieves all achievements from the database.
     * This is done to return the achievements with their IDs.
     */
    this.createdAchievements = await this.getAllAchievements();
    return this.createdAchievements;
  }

  /**
   * Retrieves all achievements from the database.
   *
   * @returns {Promise<Achievement[]>} A list of all achievements.
   */
  async getAllAchievements(): Promise<Achievement[]> {
    return this.prisma.achievement.findMany({
      include: {
        users: true,
      },
    });
  }

  /**
   * Retrieves an achievement by its ID.
   *
   * @param {string} achievementId - The ID of the achievement.
   * @returns {Promise<Achievement>} The retrieved achievement.
   * @throws {NotFoundException} If the achievement is not found.
   */
  async getAchievementById(achievementId: string): Promise<Achievement> {
    try {
      const achievement: Achievement = await this.prisma.achievement.findUnique(
        {
          where: {
            id: achievementId,
          },
          include: {
            users: true,
          },
        },
      );
      return achievement;
    } catch (e) {
      throw new NotFoundException('Achievement not found');
    }
  }

  /**
   * Updates an achievement with new data.
   *
   * @param {string} achievementId - The ID of the achievement to update.
   * @param {UpdateAchievementInput} updateAchievementInput - The updated data for the achievement.
   * @returns {Promise<Achievement>} The updated achievement.
   * @throws {NotFoundException} If the achievement is not found.
   */
  async updateAchievement(
    achievementId: string,
    updateAchievementInput: UpdateAchievementInput,
  ): Promise<Achievement> {
    try {
      const achievement: Achievement = await this.prisma.achievement.update({
        where: {
          id: achievementId,
        },
        data: {
          ...updateAchievementInput,
        },
        include: {
          users: true,
        },
      });
      return achievement;
    } catch (e) {
      throw new NotFoundException('Achievement not found');
    }
  }

  /**
   * Deletes an achievement by its ID.
   *
   * @param {string} achievementId - The ID of the achievement to delete.
   * @returns {Promise<Achievement>} The deleted achievement.
   */
  async deleteAchievement(achievementId: string): Promise<Achievement> {
    try {
      /**
       * Deletes all user achievements associated with the achievement.
       * This is done to prevent orphaned user achievements.
       * This is done before deleting the achievement to prevent a Prisma error.
       */
      await this.prisma.userAchievement.deleteMany({
        where: {
          achievementId,
        },
      });

      const achievement: Achievement = await this.prisma.achievement.delete({
        where: {
          id: achievementId,
        },
        include: {
          users: true,
        },
      });

      return achievement;
    } catch (e) {
      throw new NotFoundException('Achievement not found');
    }
  }

  /**
   * Deletes all achievements from the database and all user achievements.
   *
   * @returns {Promise<void>} A Promise that resolves when all achievements are deleted.
   */
  async deleteAllAchievements(): Promise<void> {
    await this.prisma.userAchievement.deleteMany();
    await this.prisma.achievement.deleteMany();
  }
}
