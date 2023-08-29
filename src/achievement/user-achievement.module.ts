import { Module } from '@nestjs/common';

import { UserAchievementService } from './user-achievement.service';
import { UserAchievementResolver } from './user-achievement.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [UserAchievementResolver, UserAchievementService, PrismaService],
})
export class UserAchievementModule {}
