import { Test, TestingModule } from '@nestjs/testing';
import { KickResolver } from './kick.resolver';
import { KickService } from './kick.service';

describe('KickResolver', () => {
  let resolver: KickResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KickResolver, KickService],
    }).compile();

    resolver = module.get<KickResolver>(KickResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
