import { Test, TestingModule } from '@nestjs/testing';
import { TestCircuitBreakerController } from './test-circuit-breaker.controller';
import { TestCircuitBreakerService } from './test-circuit-breaker.service';

describe('TestCircuitBreakerController', () => {
  let controller: TestCircuitBreakerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TestCircuitBreakerService,
          useValue: {
            makeRequest: jest.fn(),
            getStatus: jest.fn(),
          },
        },
      ],
      controllers: [TestCircuitBreakerController],
    }).compile();

    controller = module.get<TestCircuitBreakerController>(
      TestCircuitBreakerController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call makeRequest', async () => {
    const makeRequestSpy = jest.spyOn(controller, 'makeRequest');

    await controller.makeRequest();

    expect(makeRequestSpy).toHaveBeenCalled();
  });

  it('should call getStatus', async () => {
    const getStatusSpy = jest.spyOn(controller, 'getStatus');

    await controller.getStatus();

    expect(getStatusSpy).toHaveBeenCalled();
  });
});
