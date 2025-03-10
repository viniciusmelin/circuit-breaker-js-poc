import { Controller, Get } from '@nestjs/common';
import { TestCircuitBreakerService } from './test-circuit-breaker.service';

@Controller('test-circuit-breaker')
export class TestCircuitBreakerController {
  constructor(private readonly testService: TestCircuitBreakerService) {}

  @Get('request')
  async makeRequest(): Promise<string> {
    // Chama o método que testa o CircuitBreaker
    return this.testService.makeRequest();
  }

  @Get('status')
  async getStatus(): Promise<string> {
    // Chama o método que retorna o status do CircuitBreaker
    return this.testService.getStatus();
  }
}
