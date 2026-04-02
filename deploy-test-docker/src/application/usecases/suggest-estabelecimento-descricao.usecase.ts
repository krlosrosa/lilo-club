import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { z } from 'zod';
import {
  ESTABELECIMENTO_REPOSITORY,
  type EstabelecimentoRepository,
} from '../../domain/repositories/estabelecimento.repository.js';
import { LLM_REPOSITORY, type LlmRepository } from '../../domain/repositories/llm.repository.js';
import { ResolveAccountForUserUsecase } from './resolve-account-for-user.usecase.js';

const descricaoSugeridaLlmSchema = z.object({
  descricaoSugerida: z.string().min(1).max(8000),
});

const DESCRICAO_SUGERIDA_JSON_SCHEMA: Record<string, unknown> = {
  type: 'object',
  properties: {
    descricaoSugerida: { type: 'string', maxLength: 8000 },
  },
  required: ['descricaoSugerida'],
  additionalProperties: false,
};

@Injectable()
export class SuggestEstabelecimentoDescricaoUsecase {
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
    rascunho: string,
  ): Promise<{ descricaoSugerida: string }> {
    const trimmed = rascunho.trim();
    if (trimmed.length === 0) {
      throw new BadRequestException('Informe um texto na descrição para melhorar.');
    }

    const accountId = await this.resolveAccount.execute(userId);
    const row = await this.estabelecimentos.findByIdAndAccount(estabelecimentoId, accountId);
    if (!row) throw new NotFoundException();

    const categoriaNome =
      (await this.estabelecimentos.findCategoriaNome(row.categoriaId)) ?? '';

    const raw = await this.llm.completeStructured({
      schemaName: 'descricao_editorial_estabelecimento',
      jsonSchema: DESCRICAO_SUGERIDA_JSON_SCHEMA,
      messages: [
        {
          role: 'system',
          content: [
            'Você ajuda lojistas do Guia Comercial em português do Brasil.',
            'Melhore a descrição editorial para clareza, apelo local e tom profissional amigável.',
            'Mantenha os fatos do rascunho; não invente endereços, horários, preços ou serviços não mencionados.',
            'Não use hashtags nem emojis excessivos. Evite clichês vazios.',
            'A descrição sugerida deve ter no máximo cerca de 3000 caracteres (nunca ultrapasse 8000).',
          ].join(' '),
        },
        {
          role: 'user',
          content: [
            `Nome do estabelecimento: ${row.nome}`,
            `Categoria: ${categoriaNome}`,
            '',
            'Rascunho atual da descrição editorial:',
            trimmed,
          ].join('\n'),
        },
      ],
    });

    return descricaoSugeridaLlmSchema.parse(raw);
  }
}
