import { Resolver } from '@nestjs/graphql';
import { UserAchievementService } from './user-achievement.service';

@Resolver()
export class UserAchievementResolver {
  constructor(private readonly userAchievementService: UserAchievementService) {}
}
