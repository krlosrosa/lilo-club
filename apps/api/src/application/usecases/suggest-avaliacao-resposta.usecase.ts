import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { z } from 'zod';
import {
  ESTABELECIMENTO_REPOSITORY,
  type EstabelecimentoRepository,
} from '../../domain/repositories/estabelecimento.repository.js';
import { LLM_REPOSITORY, type LlmRepository } from '../../domain/repositories/llm.repository.js';
import { ResolveAccountForUserUsecase } from './resolve-account-for-user.usecase.js';

const sugestaoRespostaLlmSchema = z.object({
  sugestaoResposta: z.string(),
});

const SUGESTAO_RESPOSTA_JSON_SCHEMA: Record<string, unknown> = {
  type: 'object',
  properties: {
    sugestaoResposta: { type: 'string' },
  },
  required: ['sugestaoResposta'],
  additionalProperties: false,
};

export type TomSugestao = 'formal' | 'amigavel' | 'objetivo';

@Injectable()
export class SuggestAvaliacaoRespostaUsecase {
  constructor(
    private readonly resolveAccount: ResolveAccountForUserUsecase,
    @Inject(ESTABELECIMENTO_REPOSITORY)
    private readonly estabelecimentos: EstabelecimentoRepository,
    @Inject(LLM_REPOSITORY)
    private readonly llm: LlmRepository,
  ) {}

  async execute(
    userId: string,
    estabelecimentoId: string,
    avaliacaoId: string,
    tom?: TomSugestao,
  ): Promise<{ sugestaoResposta: string }> {
    const accountId = await this.resolveAccount.execute(userId);
    const avaliacao = await this.estabelecimentos.findAvaliacaoById(
      estabelecimentoId,
      accountId,
      avaliacaoId,
    );
    if (!avaliacao) throw new NotFoundException();

    const comentario = avaliacao.comentario?.trim() || '(sem comentário escrito)';
    const tomHint =
      tom === 'formal'
        ? 'Use tom formal e cordial.'
        : tom === 'objetivo'
          ? 'Use tom objetivo e direto.'
          : 'Use tom amigável e próximo do cliente.';

    const raw = await this.llm.completeStructured({
      schemaName: 'sugestao_resposta_avaliacao',
      jsonSchema: SUGESTAO_RESPOSTA_JSON_SCHEMA,
      messages: [
        {
          role: 'system',
          content: [
            'Você ajuda lojistas do Guia Comercial a responder avaliações de clientes em português do Brasil.',
            'Gere apenas o texto sugerido para resposta pública, sem saudações genéricas redundantes no início.',
            'Se a nota for baixa, reconheça o problema e ofereça contato para resolver.',
            tomHint,
          ].join(' '),
        },
        {
          role: 'user',
          content: `Nota (1-5): ${avaliacao.nota}\nComentário do cliente:\n${comentario}`,
        },
      ],
    });

    return sugestaoRespostaLlmSchema.parse(raw);
  }
}
