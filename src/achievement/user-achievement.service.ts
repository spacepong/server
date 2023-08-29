import { Injectable, NotFoundException } from '@nestjs/common';

import { User } from 'src/user/entities/user.entity';
import { Achievement } from './entities/achievement.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { userIncludes } from 'src/includes/user.includes';
import { UserAchievement } from './entities/user-achievement.entity';

export interface userAchievementsDataMapped {
  userId: string;
  achievementId: string;
}

@Injectable()
export class UserAchievementService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUserAchievements(userId: string): Promise<User> {
    try {
      const achievements: Achievement[] =
        await this.prismaService.achievement.findMany();
      const userAchievements: userAchievementsDataMapped[] = achievements.map(
        (achievement: Achievement) => ({
          userId,
          achievementId: achievement.id,
        }),
      );
      await this.prismaService.userAchievement.createMany({
        data: userAchievements,
        skipDuplicates: true,
      });
      const user: User = await this.prismaService.user.findUnique({
        where: {
          id: userId,
        },
        include: userIncludes,
      });
      return user;
    } catch (e) {
      throw new NotFoundException('Could not create user achievements');
    }
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return this.prismaService.userAchievement.findMany({
      where: {
        userId,
      },
      include: {
        achievement: true,
      },
    });
  }

  async updateUserAchievement(
    userId: string,
    achievementId: string,
    isAchieved: boolean,
  ): Promise<UserAchievement> {
    try {
      const userAchievement: UserAchievement =
        await this.prismaService.userAchievement.update({
          where: {
            userId_achievementId: {
              userId,
              achievementId,
            },
          },
          data: {
            isAchieved,
            achievedAt: isAchieved ? new Date() : null,
          },
          include: {
            achievement: true,
          },
        });
      return userAchievement;
    } catch (e) {
      throw new NotFoundException('User achievement not found');
    }
  }
}
