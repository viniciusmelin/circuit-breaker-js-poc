import { Injectable } from '@nestjs/common';
import { Options } from 'opossum';
import * as CircuitBreaker from 'opossum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CircuitBreakerService {
  private breakers = new Map<string, CircuitBreaker<any, any>>();
  private readonly errorThresholdPercentage: number;
  private readonly timeout: number;
  private readonly resetTimeout: number;
  private readonly rollingCountTimeout: number;
  private readonly rollingCountBuckets: number;
  private readonly capacity: number;

  constructor(private readonly configService: ConfigService) {
    this.errorThresholdPercentage = this.configService.get<number>(
      'CIRCUIT_BREAKER_ERROR_THRESHOLD_PERCENTAGE',
    );
    this.timeout = this.configService.get<number>('CIRCUIT_BREAKER_TIMEOUT');
    this.resetTimeout = this.configService.get<number>(
      'CIRCUIT_BREAKER_RESET_TIMEOUT',
    );
    this.rollingCountTimeout = this.configService.get<number>(
      'CIRCUIT_BREAKER_ROLLING_COUNT_TIMEOUT',
    );
    this.rollingCountBuckets = this.configService.get<number>(
      'CIRCUIT_BREAKER_ROLLING_COUNT_BUCKETS',
    );
    this.capacity = this.configService.get<number>('CIRCUIT_BREAKER_CAPACITY');
  }

  /**
   * Cria um novo CircuitBreaker ou retorna o existente.
   * @param key A chave única para identificar o circuit breaker.
   * @param action A função que será protegida pelo circuit breaker, que retorna uma Promise.
   * @param options As opções de configuração do circuit breaker.
   * @param fallback A função que será chamada caso o circuit breaker seja acionado (fallback).
   * @param maxAttempts Número máximo de tentativas antes de disparar o fallback.
   */
  createBreaker<T extends unknown[], R>(
    key: string,
    action: (input: T) => Promise<R>,
    options: Options = {
      errorThresholdPercentage: this.errorThresholdPercentage, // Limiar de erro para disparar o circuito
      timeout: this.timeout, // Timeout para a execução da ação
      resetTimeout: this.resetTimeout, // Tempo para resetar o circuito após falha
      rollingCountTimeout: this.rollingCountTimeout, // Intervalo para calcular falhas
      rollingCountBuckets: this.rollingCountBuckets, // Quantidade de buckets para calcular falhas
      capacity: this.capacity, // Capacidade do circuito para gerenciar as tentativas
    },
    fallback?: (input: T) => Promise<R>, // Função de fallback caso o circuit breaker dispare
  ): CircuitBreaker<T, R> {
    if (!this.breakers.has(key)) {
      // Verifica se o breaker com a chave já existe
      let attempts = 0; // Controla o número de tentativas falhadas

      // Cria uma nova instância do CircuitBreaker
      const breaker = new CircuitBreaker(action, options);

      // Escuta o evento de "open", quando o circuito é aberto
      breaker.on('open', () =>
        console.error(`[CircuitBreaker] ${key} is OPEN`),
      );

      // Escuta o evento de "halfOpen", quando o circuito está meio aberto
      breaker.on('halfOpen', () =>
        console.log(`[CircuitBreaker] ${key} is HALF-OPEN`),
      );

      // Escuta o evento de "close", quando o circuito está fechado
      breaker.on('close', () => {
        console.log(`[CircuitBreaker] ${key} is CLOSED`);
      });

      // Escuta o evento de "fire", quando uma tentativa é feita
      breaker.on('fire', () =>
        console.log(`[CircuitBreaker] ${key} request FIRED`),
      );

      // Escuta o evento de "reject", quando a tentativa é rejeitada
      breaker.on('reject', () =>
        console.log(`[CircuitBreaker] ${key} request REJECTED`),
      );

      // Escuta o evento de "failure", quando a tentativa falha
      breaker.on('failure', () =>
        console.log(`[CircuitBreaker] ${key} request FAILED`),
      );

      // Escuta o evento de "timeout", quando a tentativa ultrapassa o limite de tempo
      breaker.on('timeout', () =>
        console.log(`[CircuitBreaker] ${key} request TIMED OUT`),
      );

      /**
       * Função de fallback que será chamada quando o circuit breaker for acionado
       * Controla o número de tentativas falhas
       */
      breaker.fallback(async (input: T) => {
        attempts++;
        console.warn(
          `[CircuitBreaker] ${key} - Attempt ${attempts} failed, input: ${JSON.stringify(
            input,
          )}`,
        );

        return fallback
          ? fallback(input)
          : Promise.reject('Service unavailable');
      });

      // Armazena o circuit breaker na chave fornecida
      this.breakers.set(key, breaker);
    }

    // Retorna o breaker existente
    return this.breakers.get(key);
  }

  /**
   * Obtém um CircuitBreaker existente baseado na chave fornecida.
   * @param key A chave do circuit breaker.
   * @returns O CircuitBreaker ou undefined se não encontrado.
   */
  getBreaker<T extends unknown[], R>(
    key: string,
  ): CircuitBreaker<T, R> | undefined {
    return this.breakers.get(key);
  }

  setStatus(key: string, status: 'open' | 'closed') {
    if (!this.breakers.has(key)) return;
    status === 'open'
      ? this.breakers.get(key)?.open()
      : this.breakers.get(key)?.close();
    return this.getBreaker(key);
  }
}
