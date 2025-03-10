import { Global, Module } from '@nestjs/common';
import { CircuitBreakerService } from './circuit-breaker.service';

@Global()
@Module({
  providers: [CircuitBreakerService],
  exports: [CircuitBreakerService],
})
export class CircuitBreakerModule {}
