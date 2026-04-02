---
name: create-queue
description: "Cria uma fila BullMQ completa no backend NestJS: definição, producer, processor e Bull Board. Use ao adicionar processamento assíncrono a um domínio."
---

# Skill: Create Queue (BullMQ + NestJS)

Guia passo a passo para adicionar uma fila assíncrona a um domínio existente, seguindo as convenções do projeto.

## Stack
| Pacote                  | Papel                                      |
|-------------------------|--------------------------------------------|
| `@nestjs/bullmq`        | Decorators NestJS (`@Processor`, `@InjectQueue`) |
| `bullmq`                | Worker/Queue/Job nativos                   |
| `@bull-board/nestjs`    | `BullBoardModule.forFeature()`             |
| `@bull-board/api`       | `BullMQAdapter`                            |

> O `QueueModule` global (`src/main/modules/bull.module.ts`) já configura Redis e `defaultJobOptions`. **Não** reconfigure nos módulos de domínio.

---

## Estrutura de Arquivos

```
src/infra/queues/
├── [domínio]-[contexto].queue.ts   ← constantes + tipos
└── [contexto].processor.ts         ← WorkerHost
```

---

## Passo 1 — Queue Definition

**Caminho**: `src/infra/queues/[domínio]-[contexto].queue.ts`

```typescript
// Exemplo: logistica-transporte.queue.ts
export const LOGISTICA_TRANSPORTE_QUEUE = 'logistica-transporte' as const;

export const JOB_ATUALIZAR_STATUS = 'atualizar-status' as const;
export const JOB_NOTIFICAR_MOTORISTA = 'notificar-motorista' as const;

export type AtualizarStatusJobData = {
  transporteId: string;
  novoStatus: string;
  usuarioId: string;
};

export type NotificarMotoristaJobData = {
  transporteId: string;
  mensagem: string;
};
```

**Regras**:
- Nome da fila em **kebab-case** como `const` string.
- Jobs em **SCREAMING_SNAKE_CASE** com prefixo `JOB_`.
- Cada job tem seu próprio tipo `[Acao]JobData`.
- Use `as const` para tipagem literal.

---

## Passo 2 — Processor (WorkerHost)

**Caminho**: `src/infra/queues/[contexto].processor.ts`

```typescript
// Exemplo: transporte-status.processor.ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { AtualizarStatusTransporteUsecase } from '../../application/usecases/transporte/atualizar-status-transporte.usecase.js';
import {
  LOGISTICA_TRANSPORTE_QUEUE,
  JOB_ATUALIZAR_STATUS,
  type AtualizarStatusJobData,
} from './logistica-transporte.queue.js';

@Processor(LOGISTICA_TRANSPORTE_QUEUE)
export class TransporteStatusProcessor extends WorkerHost {
  private readonly logger = new Logger(TransporteStatusProcessor.name);

  constructor(
    private readonly atualizarStatusUsecase: AtualizarStatusTransporteUsecase,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    this.logger.log(`Processando job "${job.name}" (id: ${job.id})`);

    switch (job.name) {
      case JOB_ATUALIZAR_STATUS:
        await this.handleAtualizarStatus(job.data as AtualizarStatusJobData);
        break;
      default:
        this.logger.warn(`Job desconhecido: ${job.name}`);
    }
  }

  private async handleAtualizarStatus(data: AtualizarStatusJobData): Promise<void> {
    try {
      await this.atualizarStatusUsecase.execute(data);
    } catch (error) {
      this.logger.error(`Erro ao atualizar status do transporte ${data.transporteId}`, error);
      throw error; // Re-lança para BullMQ gerenciar retries via defaultJobOptions
    }
  }
}
```

**Regras**:
- `@Processor(DOMINIO_QUEUE)` usa **const importada**, nunca string literal.
- `extends WorkerHost` com `async process(job: Job): Promise<void>`.
- Use `switch (job.name)` para múltiplos tipos de job.
- **Sempre re-lance erros** para BullMQ gerenciar retries automaticamente.
- Injete UseCases via construtor (DI padrão NestJS).
- Use `Logger` do NestJS para observabilidade.

---

## Passo 3 — Producer (UseCase ou Controller)

Quando um UseCase precisa enfileirar trabalho:

```typescript
// Exemplo: solicitar-atualizacao-status.usecase.ts
import { Inject, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  LOGISTICA_TRANSPORTE_QUEUE,
  JOB_ATUALIZAR_STATUS,
  type AtualizarStatusJobData,
} from '../../infra/queues/logistica-transporte.queue.js';

@Injectable()
export class SolicitarAtualizacaoStatusUsecase {
  constructor(
    @InjectQueue(LOGISTICA_TRANSPORTE_QUEUE)
    private readonly transporteQueue: Queue,
  ) {}

  async execute(data: AtualizarStatusJobData): Promise<void> {
    await this.transporteQueue.add(JOB_ATUALIZAR_STATUS, data, {
      jobId: `atualizar-status-${data.transporteId}`, // idempotência
    });
  }
}
```

**Regras**:
- `@InjectQueue(DOMINIO_QUEUE)` com **const importada**.
- Use `jobId` baseado em dados de negócio para **evitar jobs duplicados**.
- O tipo do job é o segundo argumento de `.add()`.
- Não passe `attempts`/`backoff` por job — o `QueueModule` global já define.

---

## Passo 4 — Module Registration

Atualize o módulo de domínio existente:

```typescript
// Exemplo: transporte.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { drizzleProvider } from 'src/infra/db/config/drizzle.provider';
import { TransporteService } from 'src/infra/db/transporte/transporte.service';
import { transporteUseCases } from 'src/application/transporte';
import { transporteControllers } from 'src/presentation/controllers/transporte';
import { TRANSPORTE_REPOSITORY } from 'src/domain/repositories/transporte.repository';
import { LOGISTICA_TRANSPORTE_QUEUE } from 'src/infra/queues/logistica-transporte.queue';
import { TransporteStatusProcessor } from 'src/infra/queues/transporte-status.processor';
import { SolicitarAtualizacaoStatusUsecase } from 'src/application/usecases/transporte/solicitar-atualizacao-status.usecase';

@Module({
  imports: [
    BullModule.registerQueue({ name: LOGISTICA_TRANSPORTE_QUEUE }),
    BullBoardModule.forFeature({
      name: LOGISTICA_TRANSPORTE_QUEUE,
      adapter: BullMQAdapter,
    }),
  ],
  controllers: [...transporteControllers],
  providers: [
    drizzleProvider,
    ...transporteUseCases,
    SolicitarAtualizacaoStatusUsecase, // producer (se não estiver no barrel)
    TransporteStatusProcessor,          // processor
    {
      provide: TRANSPORTE_REPOSITORY,
      useClass: TransporteService,
    },
  ],
})
export class TransporteModule {}
```

**Regras**:
- `BullModule.registerQueue` + `BullBoardModule.forFeature` sempre **juntos**.
- O `Processor` e todos os UseCases que usam `@InjectQueue` devem ser `providers`.
- O `BullBoardModule.forRoot` já está em `AppModule` — **não** repita.
- O `QueueModule` global já está em `src/main/modules/index.ts` — **não** repita a config Redis.

---

## Passo 5 — Testes do Processor

**Caminho**: `test/infra/queues/[contexto].processor.spec.ts`

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { TransporteStatusProcessor } from '../../../src/infra/queues/transporte-status.processor';
import { AtualizarStatusTransporteUsecase } from '../../../src/application/usecases/transporte/atualizar-status-transporte.usecase';
import { JOB_ATUALIZAR_STATUS } from '../../../src/infra/queues/logistica-transporte.queue';
import type { Job } from 'bullmq';

describe('TransporteStatusProcessor', () => {
  let processor: TransporteStatusProcessor;
  let usecase: jest.Mocked<AtualizarStatusTransporteUsecase>;

  beforeEach(async () => {
    const mockUsecase = { execute: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransporteStatusProcessor,
        { provide: AtualizarStatusTransporteUsecase, useValue: mockUsecase },
      ],
    }).compile();

    processor = module.get(TransporteStatusProcessor);
    usecase = module.get(AtualizarStatusTransporteUsecase);
  });

  it('deve chamar usecase ao receber job correto', async () => {
    const jobData = { transporteId: 'T-001', novoStatus: 'EM_ROTA', usuarioId: 'U-1' };
    const job = { name: JOB_ATUALIZAR_STATUS, data: jobData, id: '1' } as unknown as Job;

    await processor.process(job);

    expect(usecase.execute).toHaveBeenCalledWith(jobData);
  });

  it('deve re-lançar erro do usecase para BullMQ gerenciar retry', async () => {
    const error = new Error('Falha na atualização');
    usecase.execute.mockRejectedValue(error);
    const job = {
      name: JOB_ATUALIZAR_STATUS,
      data: { transporteId: 'T-001', novoStatus: 'EM_ROTA', usuarioId: 'U-1' },
      id: '1',
    } as unknown as Job;

    await expect(processor.process(job)).rejects.toThrow('Falha na atualização');
  });

  it('não deve lançar erro para jobs desconhecidos', async () => {
    const job = { name: 'job-inexistente', data: {}, id: '2' } as unknown as Job;
    await expect(processor.process(job)).resolves.toBeUndefined();
  });
});
```

---

## Checklist Final

### Implementação
- [ ] `[domínio]-[contexto].queue.ts` criado com `QUEUE`, `JOB_*` e tipos de data
- [ ] `[contexto].processor.ts` criado com `@Processor` + `extends WorkerHost`
- [ ] Producer criado (UseCase ou Controller) com `@InjectQueue`
- [ ] `BullModule.registerQueue` adicionado ao módulo de domínio
- [ ] `BullBoardModule.forFeature` adicionado ao módulo de domínio
- [ ] Processor e Producer adicionados aos `providers` do módulo

### Padrões obrigatórios
- [ ] `@Processor(DOMINIO_QUEUE)` e `@InjectQueue(DOMINIO_QUEUE)` usam **const importada**
- [ ] `jobId` definido no `.add()` para idempotência
- [ ] Erros re-lançados no Processor (não engolidos)
- [ ] `Logger` do NestJS usado no Processor
- [ ] Imports com `.js` nos arquivos de infra (ESM)

### Testes
- [ ] Teste do Processor em `test/infra/queues/`
- [ ] Happy path, erro re-lançado, job desconhecido ignorado
