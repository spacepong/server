import { Test, TestingModule } from '@nestjs/testing';
import { BanResolver } from './ban.resolver';
import { BanService } from './ban.service';

describe('BanResolver', () => {
  let resolver: BanResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BanResolver, BanService],
    }).compile();

    resolver = module.get<BanResolver>(BanResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
