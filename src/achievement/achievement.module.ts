import { Module } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { AchievementResolver } from './achievement.resolver';

@Module({
  providers: [AchievementResolver, AchievementService],
})
export class AchievementModule {}
