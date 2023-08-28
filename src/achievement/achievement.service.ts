import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { Achievement } from './entities/achievement.entity';
import { AchievementData, achievements } from 'src/achievements';
import { UpdateAchievementInput } from './dto/update-achievement.input';

/**
 * Service responsible for handling achievements-related operations.
 *
 * @export
 * @class AchievementService
 * @module achievement
 */
@Injectable()
export class AchievementService {
  /**
   * Creates an instance of the AchievementService class.
   *
   * @param {PrismaService} prisma - The Prisma service for database interactions.
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates achievements by adding them to the database.
   *
   * @returns {Promise<Achievement[]>} A list of created achievements.
   */
  async createAchievements(): Promise<Achievement[]> {
    return Promise.all(
      achievements.map(async (achievement: AchievementData) => {
        const createdAchievement: Achievement =
          await this.prisma.achievement.create({
            data: achievement,
          });
        return createdAchievement;
      }),
    );
  }

  /**
   * Retrieves all achievements from the database.
   *
   * @returns {Promise<Achievement[]>} A list of all achievements.
   */
  async getAllAchievements(): Promise<Achievement[]> {
    return this.prisma.achievement.findMany();
  }

  /**
   * Retrieves an achievement by its ID.
   *
   * @param {string} achievementId - The ID of the achievement.
   * @returns {Promise<Achievement>} The retrieved achievement.
   */
  async getAchievementById(achievementId: string): Promise<Achievement> {
    return this.prisma.achievement.findUnique({
      where: {
        id: achievementId,
      },
    });
  }

  /**
   * Updates an achievement with new data.
   *
   * @param {string} achievementId - The ID of the achievement to update.
   * @param {UpdateAchievementInput} updateAchievementInput - The updated data for the achievement.
   * @returns {Promise<Achievement>} The updated achievement.
   */
  async updateAchievement(
    achievementId: string,
    updateAchievementInput: UpdateAchievementInput,
  ): Promise<Achievement> {
    return this.prisma.achievement.update({
      where: {
        id: achievementId,
      },
      data: updateAchievementInput,
    });
  }

  /**
   * Deletes an achievement by its ID.
   *
   * @param {string} achievementId - The ID of the achievement to delete.
   * @returns {Promise<Achievement>} The deleted achievement.
   */
  async deleteAchievement(achievementId: string): Promise<Achievement> {
    return this.prisma.achievement.delete({
      where: {
        id: achievementId,
      },
    });
  }

  /**
   * Deletes all achievements from the database.
   *
   * @returns {Promise<void>} A Promise that resolves when all achievements are deleted.
   */
  async deleteAllAchievements(): Promise<void> {
    await this.prisma.achievement.deleteMany();
  }
}
