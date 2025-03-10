import { Module } from '@nestjs/common';
import { TestCircuitBreakerService } from './test-circuit-breaker.service';
import { TestCircuitBreakerController } from './test-circuit-breaker.controller';

@Module({
  providers: [TestCircuitBreakerService],
  controllers: [TestCircuitBreakerController],
  exports: [TestCircuitBreakerService],
})
export class TestCircuitBreakerModule {}
