import { Test, TestingModule } from '@nestjs/testing';
import { AchievementResolver } from './achievement.resolver';
import { AchievementService } from './achievement.service';

describe('AchievementResolver', () => {
  let resolver: AchievementResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AchievementResolver, AchievementService],
    }).compile();

    resolver = module.get<AchievementResolver>(AchievementResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
