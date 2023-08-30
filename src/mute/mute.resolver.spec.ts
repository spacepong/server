import { Test, TestingModule } from '@nestjs/testing';
import { MuteResolver } from './mute.resolver';
import { MuteService } from './mute.service';

describe('MuteResolver', () => {
  let resolver: MuteResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MuteResolver, MuteService],
    }).compile();

    resolver = module.get<MuteResolver>(MuteResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
