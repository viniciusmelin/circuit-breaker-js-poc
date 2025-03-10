import { Injectable } from '@nestjs/common';
import { CircuitBreakerService } from '../circuit-breaker/circuit-breaker.service';

@Injectable()
export class TestCircuitBreakerService {
  constructor(private readonly circuitBreakerService: CircuitBreakerService) {}

  /**
   * Simula uma requisição que pode falhar para testar o CircuitBreaker.
   */
  async makeRequest(): Promise<string> {
    // Função simulada que tem uma chance de falhar
    const action = async (data: any): Promise<string> => {
      const success = Math.random() > 0.5; // 50% de chance de falhar
      if (success) {
        console.log('Request succeeded');
        return 'Request succeeded';
      } else {
        console.log('Request failed');
        throw new Error('Request failed');
      }
    };

    // Configurações do Circuit Breaker
    const breaker = this.circuitBreakerService.createBreaker(
      'testBreaker',
      action,
      {
        timeout: 1000, // Tempo limite de 1 segundo
        errorThresholdPercentage: 50, // Limiar de erro de 50%
        resetTimeout: 30000, // Timeout para resetar o circuito
        rollingCountTimeout: 30000,
      },
    );

    // Faz a requisição utilizando o circuit breaker
    try {
      const result = await breaker.fire({ teste: 'teste', name: 'teste' });
      return result;
    } catch (error) {
      console.error('Circuit breaker fallback:', error);
      return 'Circuit breaker activated. Fallback response';
    }
  }

  async getStatus(): Promise<any> {
    // Retorna o status atual do circuit breaker
    const status = this.circuitBreakerService.getBreaker('testBreaker');
    return status;
  }
}
