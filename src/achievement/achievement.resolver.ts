import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ForbiddenException } from '@nestjs/common';

import { AchievementService } from './achievement.service';
import { Achievement } from './entities/achievement.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UpdateAchievementInput } from './dto/update-achievement.input';

/**
 * Resolver responsible for handling achievements-related GraphQL queries and mutations.
 *
 * @export
 * @class AchievementResolver
 * @module achievement
 */
@Resolver()
export class AchievementResolver {
  /**
   * Creates an instance of the AchievementResolver class.
   *
   * @param {AchievementService} achievementService - The achievement service for interacting with achievement-related data.
   */
  constructor(private readonly achievementService: AchievementService) {}

  /**
   * Mutation to create all achievements.
   *
   * @param {boolean} isAdmin - Whether the user is an admin.
   * @returns {Promise<Achievement[]>} A list of created achievements.
   * @throws {ForbiddenException} If the user is not authorized.
   */
  @Mutation(() => [Achievement], {
    name: 'createAchievements',
    description: 'Creates all achievements',
  })
  async createAchievements(
    @CurrentUser('isAdmin') isAdmin: boolean,
  ): Promise<Achievement[]> {
    if (!isAdmin)
      throw new ForbiddenException(
        'User not authorized to create achievements',
      );
    return this.achievementService.createAchievements();
  }

  /**
   * Mutation to refresh all users achievements.
   *
   * @param {boolean} isAdmin - Whether the user is an admin.
   * @returns {Promise<Achievement[]>} A list of refreshed achievements.
   * @throws {ForbiddenException} If the user is not authorized.
   */
  @Mutation(() => [Achievement], {
    name: 'refreshUsersAchievements',
    description: 'Refreshes all users achievements',
  })
  async refreshUsersAchievements(
    @CurrentUser('isAdmin') isAdmin: boolean,
  ): Promise<Achievement[]> {
    if (!isAdmin)
      throw new ForbiddenException(
        'User not authorized to refresh achievements',
      );
    return this.achievementService.refreshUsersAchievements();
  }

  /**
   * Query to get all achievements.
   *
   * @returns {Promise<Achievement[]>} A list of all achievements.
   */
  @Query(() => [Achievement], {
    name: 'getAllAchievements',
    description: 'Gets all achievements',
  })
  async getAllAchievements(): Promise<Achievement[]> {
    return this.achievementService.getAllAchievements();
  }

  /**
   * Query to get an achievement by its ID.
   *
   * @param {string} achievementId - The ID of the achievement.
   * @returns {Promise<Achievement>} The retrieved achievement.
   */
  @Query(() => Achievement, {
    name: 'getAchievementById',
    description: 'Gets an achievement by ID',
  })
  async getAchievementById(
    @Args('achievementId', { type: () => String }) achievementId: string,
  ): Promise<Achievement> {
    return this.achievementService.getAchievementById(achievementId);
  }

  /**
   * Mutation to update an achievement.
   *
   * @param {boolean} isAdmin - Whether the user is an admin.
   * @param {string} achievementId - The ID of the achievement to update.
   * @param {UpdateAchievementInput} updateAchievementInput - The updated data for the achievement.
   * @returns {Promise<Achievement>} The updated achievement.
   * @throws {ForbiddenException} If the user is not authorized.
   */
  @Mutation(() => Achievement, {
    name: 'updateAchievement',
    description: 'Updates an achievement',
  })
  async updateAchievement(
    @CurrentUser('isAdmin') isAdmin: boolean,
    @Args('achievementId', { type: () => String }) achievementId: string,
    @Args('updateAchievementInput', { type: () => UpdateAchievementInput })
    updateAchievementInput: UpdateAchievementInput,
  ): Promise<Achievement> {
    if (!isAdmin)
      throw new ForbiddenException(
        'User not authorized to update achievements',
      );
    return this.achievementService.updateAchievement(
      achievementId,
      updateAchievementInput,
    );
  }

  /**
   * Mutation to delete an achievement.
   *
   * @param {boolean} isAdmin - Whether the user is an admin.
   * @param {string} achievementId - The ID of the achievement to delete.
   * @returns {Promise<Achievement>} The deleted achievement.
   * @throws {ForbiddenException} If the user is not authorized.
   */
  @Mutation(() => Achievement, {
    name: 'deleteAchievement',
    description: 'Deletes an achievement',
  })
  async deleteAchievement(
    @CurrentUser('isAdmin') isAdmin: boolean,
    @Args('achievementId', { type: () => String }) achievementId: string,
  ): Promise<Achievement> {
    if (!isAdmin)
      throw new ForbiddenException(
        'User not authorized to delete achievements',
      );
    return this.achievementService.deleteAchievement(achievementId);
  }

  /**
   * Mutation to delete all achievements.
   *
   * @param {boolean} isAdmin - Whether the user is an admin.
   * @returns {Promise<string>} A message indicating the deletion.
   * @throws {ForbiddenException} If the user is not authorized.
   */
  @Mutation(() => String, {
    name: 'deleteAllAchievements',
    description: 'Deletes all achievements',
  })
  async deleteAllAchievements(
    @CurrentUser('isAdmin') isAdmin: boolean,
  ): Promise<string> {
    if (!isAdmin)
      throw new ForbiddenException(
        'User not authorized to delete achievements',
      );
    await this.achievementService.deleteAllAchievements();
    return 'All achievements deleted';
  }
}
