import { Test, TestingModule } from '@nestjs/testing';
import { UserAchievementResolver } from './user-achievement.resolver';
import { UserAchievementService } from './user-achievement.service';

describe('UserAchievementResolver', () => {
  let resolver: UserAchievementResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserAchievementResolver, UserAchievementService],
    }).compile();

    resolver = module.get<UserAchievementResolver>(UserAchievementResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
