import { Module } from '@nestjs/common';
import { UserAchievementService } from './user-achievement.service';
import { UserAchievementResolver } from './user-achievement.resolver';

@Module({
  providers: [UserAchievementResolver, UserAchievementService],
})
export class UserAchievementModule {}
