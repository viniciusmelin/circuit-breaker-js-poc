import { Test, TestingModule } from '@nestjs/testing';
import { TestCircuitBreakerService } from './test-circuit-breaker.service';
import { CircuitBreakerModule } from '../circuit-breaker/circuit-breaker.module';

describe('TestCircuitBreakService', () => {
  let service: TestCircuitBreakerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CircuitBreakerModule],
      providers: [TestCircuitBreakerService],
    }).compile();

    service = module.get<TestCircuitBreakerService>(TestCircuitBreakerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
