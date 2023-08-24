import { Test, TestingModule } from '@nestjs/testing';
import { AvatarResolver } from './avatar.resolver';

describe('AvatarResolver', () => {
  let resolver: AvatarResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AvatarResolver],
    }).compile();

    resolver = module.get<AvatarResolver>(AvatarResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
