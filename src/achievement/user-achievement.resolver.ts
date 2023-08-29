import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ForbiddenException } from '@nestjs/common';

import { DEBUG } from 'src/constants';
import { User } from 'src/user/entities/user.entity';
import { UserAchievementService } from './user-achievement.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserAchievement } from './entities/user-achievement.entity';
import { CurrentUserId } from 'src/auth/decorators/current-userid.decorator';

@Resolver()
export class UserAchievementResolver {
  constructor(
    private readonly userAchievementService: UserAchievementService,
  ) {}

  @Mutation(() => User, {
    name: 'createUserAchievements',
    description: 'Create user achievements for a user.',
  })
  async createUserAchievements(
    @CurrentUser('isAdmin') isAdmin: boolean,
    @Args('userId', { type: () => String }) userId: string,
  ): Promise<User> {
    if (!isAdmin) throw new ForbiddenException('User not authorized');
    return this.userAchievementService.createUserAchievements(userId);
  }

  @Mutation(() => [UserAchievement], {
    name: 'getUserAchievements',
    description: 'Get achievements of a user.',
  })
  async getUserAchievements(
    @Args('userId', { type: () => String }) userId: string,
  ): Promise<UserAchievement[]> {
    return this.userAchievementService.getUserAchievements(userId);
  }

  @Mutation(() => UserAchievement, {
    name: 'updateUserAchievement',
    description: 'Update an achievement of a user.',
  })
  async updateUserAchievement(
    @CurrentUserId() id: string,
    @Args('userId', { type: () => String }) userId: string,
    @Args('achievementId', { type: () => String }) achievementId: string,
    @Args('isAchieved', { type: () => Boolean }) isAchieved: boolean,
  ): Promise<UserAchievement> {
    if (id !== userId && !DEBUG)
      throw new ForbiddenException('User not authorized');
    return this.userAchievementService.updateUserAchievement(
      userId,
      achievementId,
      isAchieved,
    );
  }
}
