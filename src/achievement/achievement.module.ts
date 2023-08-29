import { Module } from '@nestjs/common';

import { AchievementService } from './achievement.service';
import { AchievementResolver } from './achievement.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { AchievementController } from './achievement.controller';

@Module({
  providers: [AchievementResolver, AchievementService, PrismaService],
  controllers: [AchievementController],
})
export class AchievementModule {}
