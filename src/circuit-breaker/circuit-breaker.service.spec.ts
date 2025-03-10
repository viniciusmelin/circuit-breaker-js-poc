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

  it('should return an existing circuit breaker', () => {
    const action = jest.fn().mockResolvedValue('success');
    const breaker2 = service.createBreaker('test', action);

    const breakerTest = service.getBreaker('test');

    expect(breakerTest).toBe(breaker2);
  });

  it('should return undefined when not exists a circuit breaker', () => {
    const action = jest.fn().mockResolvedValue('success');
    service.createBreaker('test', action);
    const breakerTest = service.setStatus('test12', 'open');

    expect(breakerTest).toBe(undefined);
  });
  it('should set the status of a circuit breaker to open', () => {
    const action = jest.fn().mockResolvedValue('success');
    service.createBreaker('test', action);
    service.setStatus('test', 'open');

    const breaker = service.getBreaker('test');
    expect(breaker?.opened).toEqual(true);
    expect(breaker?.closed).toEqual(false);
  });

  it('should set the status of a circuit breaker to closed', () => {
    const action = jest.fn().mockResolvedValue('success');
    service.createBreaker('test', action);
    service.setStatus('test', 'closed');

    const breaker = service.getBreaker('test');
    expect(breaker?.opened).toEqual(false);
    expect(breaker?.closed).toEqual(true);
  });

  it('should call the fallback function when the circuit breaker is triggered', async () => {
    const action = jest.fn().mockRejectedValue('error');
    const fallback = jest.fn().mockResolvedValue('fallback');
    const breaker = service.createBreaker('test', action, {}, fallback);

    await expect(breaker.fire([])).resolves.toBe('fallback');
    expect(fallback).toHaveBeenCalled();
  });

  it('should return reject when calling the fallback function when the circuit breaker is triggered', async () => {
    const action = jest.fn().mockRejectedValue('error');
    const breaker = service.createBreaker('test', action);

    await expect(breaker.fire([])).rejects.toBe('Service unavailable');
  });

  it('should log events when circuit breaker state changes', () => {
    const action = jest.fn().mockResolvedValue('success');
    const breaker = service.createBreaker('test', action);

    const consoleSpy = jest.spyOn(console, 'log');
    const consoleErrorSpy = jest.spyOn(console, 'error');

    breaker.emit('open');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[CircuitBreaker] test is OPEN',
    );

    breaker.emit('halfOpen');
    expect(consoleSpy).toHaveBeenCalledWith(
      '[CircuitBreaker] test is HALF-OPEN',
    );

    breaker.emit('close');
    expect(consoleSpy).toHaveBeenCalledWith('[CircuitBreaker] test is CLOSED');

    breaker.emit('fire');
    expect(consoleSpy).toHaveBeenCalledWith(
      '[CircuitBreaker] test request FIRED',
    );

    breaker.emit('reject');
    expect(consoleSpy).toHaveBeenCalledWith(
      '[CircuitBreaker] test request REJECTED',
    );

    breaker.emit('failure');
    expect(consoleSpy).toHaveBeenCalledWith(
      '[CircuitBreaker] test request FAILED',
    );

    breaker.emit('timeout');
    expect(consoleSpy).toHaveBeenCalledWith(
      '[CircuitBreaker] test request TIMED OUT',
    );
  });

  it('should increment attempts and call fallback on failure', async () => {
    const action = jest.fn().mockRejectedValue('error');
    const fallback = jest.fn().mockResolvedValue('fallback');
    const breaker = service.createBreaker('test', action, {}, fallback);

    const consoleWarnSpy = jest.spyOn(console, 'warn');

    await expect(breaker.fire([])).resolves.toBe('fallback');
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '[CircuitBreaker] test - Attempt 1 failed, input: []',
    );
  });
});
