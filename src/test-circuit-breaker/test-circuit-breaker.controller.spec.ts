import { Test, TestingModule } from '@nestjs/testing';
import { TestCircuitBreakerController } from './test-circuit-breaker.controller';

describe('TestCircuitBreakerController', () => {
  let controller: TestCircuitBreakerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestCircuitBreakerController],
    }).compile();

    controller = module.get<TestCircuitBreakerController>(
      TestCircuitBreakerController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
