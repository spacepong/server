import { Test, TestingModule } from '@nestjs/testing';
import { KickService } from './kick.service';

describe('KickService', () => {
  let service: KickService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KickService],
    }).compile();

    service = module.get<KickService>(KickService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
