import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    // Create a testing module and compile it
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    // Get an instance of PrismaService from the testing module
    service = module.get<PrismaService>(PrismaService);
  });

  // Test case: Check if the service is defined
  it('should be defined', () => {
    // Assertion: The service should be defined
    expect(service).toBeDefined();
  });
});
