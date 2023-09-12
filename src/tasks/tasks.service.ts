import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AchievementService } from 'src/achievement/achievement.service';

import { MuteService } from 'src/mute/mute.service';

/**
 * Service dealing with scheduled tasks.
 *
 * @export
 * @class TasksService
 */
@Injectable()
export class TasksService {
  /**
   * Creates an instance of TasksService.
   *
   * @param {MuteService} muteService - The mute service.
   */
  constructor(
    private readonly muteService: MuteService,
    private readonly achievementService: AchievementService,
  ) {}

  /**
   * @description
   * This method is scheduled to run every 30 seconds.
   * It clears all expired mutes.
   */
  @Cron('0,30 * * * * *')
  async clearExpiredMutes() {
    await this.muteService.clearExpiredMutes();
  }

  /**
   * @description
   * This method is scheduled to run every hour.
   * It refreshes the achievements of all users.
   * This is done to ensure that the achievements are up-to-date.
   */
  @Cron('0 0 * * * *')
  async refreshAchievements() {
    console.log('Refreshing achievements...');
    await this.achievementService.refreshUsersAchievements();
  }
}
