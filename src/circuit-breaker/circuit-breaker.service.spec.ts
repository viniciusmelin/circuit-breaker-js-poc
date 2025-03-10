import { Test, TestingModule } from '@nestjs/testing';
import { CircuitBreakerService } from './circuit-breaker.service';
import { ConfigModule } from '@nestjs/config';

describe('CircuitBreakerService', () => {
  let service: CircuitBreakerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [CircuitBreakerService],
    }).compile();

    service = module.get<CircuitBreakerService>(CircuitBreakerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new circuit breaker', () => {
    const action = jest.fn().mockResolvedValue('success');
    const breaker = service.createBreaker('test', action);

    expect(breaker).toBeDefined();
    expect(service.getBreaker('test')).toBe(breaker);
  });

  it('should return an existing circuit breaker', () => {
    const action = jest.fn().mockResolvedValue('success');
    const breaker1 = service.createBreaker('test', action);
    const breaker2 = service.getBreaker('test');

    expect(breaker1).toBe(breaker2);
  });

  it('should set the status of a circuit breaker to open', () => {
    const action = jest.fn().mockResolvedValue('success');
    service.createBreaker('test', action);
    service.setStatus('test', 'open');

    const breaker = service.getBreaker('test');
    expect(breaker?.status).toBe('open');
  });

  it('should set the status of a circuit breaker to closed', () => {
    const action = jest.fn().mockResolvedValue('success');
    service.createBreaker('test', action);
    service.setStatus('test', 'closed');

    const breaker = service.getBreaker('test');
    expect(breaker?.status).toBe('closed');
  });

  it('should call the fallback function when the circuit breaker is triggered', async () => {
    const action = jest.fn().mockRejectedValue('error');
    const fallback = jest.fn().mockResolvedValue('fallback');
    const breaker = service.createBreaker('test', action, {}, fallback);

    await expect(breaker.fire([])).resolves.toBe('fallback');
    expect(fallback).toHaveBeenCalled();
  });
});
