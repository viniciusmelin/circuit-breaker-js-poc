import { Module } from '@nestjs/common';
import { CircuitBreakerModule } from './circuit-breaker/circuit-breaker.module';
import { TestCircuitBreakerModule } from './test-circuit-breaker/test-circuit-breaker.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Torna as configurações globais para todo o app
      envFilePath: '.env', // Caminho do arquivo .env
    }),
    CircuitBreakerModule,
    TestCircuitBreakerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
