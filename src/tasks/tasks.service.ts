import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

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
  constructor(private readonly muteService: MuteService) {}

  /**
   * @description
   * This method is scheduled to run every 30 seconds.
   * It clears all expired mutes.
   */
  @Cron('0,30 * * * * *')
  async clearExpiredMutes() {
    await this.muteService.clearExpiredMutes();
  }
}
