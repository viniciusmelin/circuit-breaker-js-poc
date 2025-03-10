import { Test, TestingModule } from '@nestjs/testing';
import { TestCircuitBreakService } from './test-circuit-breaker.service';

describe('TestCircuitBreakService', () => {
  let service: TestCircuitBreakService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestCircuitBreakService],
    }).compile();

    service = module.get<TestCircuitBreakService>(TestCircuitBreakService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
