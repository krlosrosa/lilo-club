import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { z } from 'zod';
import {
  ESTABELECIMENTO_REPOSITORY,
  type EstabelecimentoRepository,
} from '../../domain/repositories/estabelecimento.repository.js';
import { LLM_REPOSITORY, type LlmRepository } from '../../domain/repositories/llm.repository.js';
import { ResolveAccountForUserUsecase } from './resolve-account-for-user.usecase.js';

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

const llmHorarioSlotSchema = z.object({
  diaSemana: z.number().int().min(0).max(6),
  abre: z.string().regex(TIME_RE),
  fecha: z.string().regex(TIME_RE),
});

const llmHorariosOutputSchema = z.object({
  intervalos: z.array(llmHorarioSlotSchema),
});

const HORARIOS_JSON_SCHEMA: Record<string, unknown> = {
  type: 'object',
  properties: {
    intervalos: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          diaSemana: { type: 'integer', minimum: 0, maximum: 6 },
          abre: { type: 'string' },
          fecha: { type: 'string' },
        },
        required: ['diaSemana', 'abre', 'fecha'],
        additionalProperties: false,
      },
    },
  },
  required: ['intervalos'],
  additionalProperties: false,
};

export type SuggestEstabelecimentoHorarioResult = {
  intervalos: { diaSemana: number; ordem: number; abre: string; fecha: string }[];
};

@Injectable()
export class SuggestEstabelecimentoHorarioUsecase {
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
    texto: string,
  ): Promise<SuggestEstabelecimentoHorarioResult> {
    const trimmed = texto.trim();
    if (trimmed.length === 0) {
      throw new BadRequestException('Descreva os horários em texto para interpretar.');
    }

    const accountId = await this.resolveAccount.execute(userId);
    const row = await this.estabelecimentos.findByIdAndAccount(estabelecimentoId, accountId);
    if (!row) throw new NotFoundException();

    const raw = await this.llm.completeStructured({
      schemaName: 'horarios_estabelecimento_natural',
      jsonSchema: HORARIOS_JSON_SCHEMA,
      messages: [
        {
          role: 'system',
          content: [
            'Você converte descrições de horário de funcionamento em português do Brasil para dados estruturados.',
            'diaSemana: inteiro 0=domingo, 1=segunda, 2=terça, 3=quarta, 4=quinta, 5=sexta, 6=sábado.',
            'abre e fecha: sempre strings no formato 24h HH:MM (ex.: 08:00, 18:00, 17:30).',
            'Inclua na lista apenas dias em que o estabelecimento abre; dias não mencionados ficam fechados.',
            'Vários turnos no mesmo dia viram vários objetos com o mesmo diaSemana (ex.: manhã e tarde).',
            'Não invente horários: use apenas o que o usuário indicou. Se algo for ambíguo, faça a interpretação mais conservadora.',
            'Para intervalos do tipo "até 17h", interprete como abertura típica da manhã (09:00) só se o usuário não deu abertura; preferir inferir abertura coerente com outros dias do texto.',
          ].join(' '),
        },
        {
          role: 'user',
          content: [`Nome do estabelecimento: ${row.nome}`, '', 'Texto do lojista:', trimmed].join('\n'),
        },
      ],
    });

    const parsed = llmHorariosOutputSchema.safeParse(raw);
    if (!parsed.success) {
      throw new BadRequestException(
        'Não foi possível interpretar os horários. Reformule o texto ou use horários mais explícitos.',
      );
    }

    for (const it of parsed.data.intervalos) {
      if (it.abre >= it.fecha) {
        throw new BadRequestException(
          `Intervalo inválido (${it.abre}–${it.fecha}) no dia ${it.diaSemana}: a abertura deve ser antes do fechamento.`,
        );
      }
    }

    const withIdx = parsed.data.intervalos.map((it, i) => ({ ...it, i }));
    withIdx.sort((a, b) => a.diaSemana - b.diaSemana || a.i - b.i);

    const ordemByDay = new Map<number, number>();
    const intervalos: SuggestEstabelecimentoHorarioResult['intervalos'] = withIdx.map((row) => {
      const ordem = ordemByDay.get(row.diaSemana) ?? 0;
      ordemByDay.set(row.diaSemana, ordem + 1);
      return { diaSemana: row.diaSemana, ordem, abre: row.abre, fecha: row.fecha };
    });

    return { intervalos };
  }
}
