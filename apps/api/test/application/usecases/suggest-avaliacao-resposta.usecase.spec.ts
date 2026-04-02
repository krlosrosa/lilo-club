import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { SuggestAvaliacaoRespostaUsecase } from '../../../src/application/usecases/suggest-avaliacao-resposta.usecase.js';
import { ResolveAccountForUserUsecase } from '../../../src/application/usecases/resolve-account-for-user.usecase.js';
import { ESTABELECIMENTO_REPOSITORY } from '../../../src/domain/repositories/estabelecimento.repository.js';
import { LLM_REPOSITORY } from '../../../src/domain/repositories/llm.repository.js';

describe('SuggestAvaliacaoRespostaUsecase', () => {
  const userId = '550e8400-e29b-41d4-a716-446655440000';
  const estabelecimentoId = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee';
  const avaliacaoId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  const accountId = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';

  it('returns parsed suggestion when avaliacao exists and LLM returns valid JSON', async () => {
    const findAvaliacaoById = jest.fn().mockResolvedValue({
      id: avaliacaoId,
      estabelecimentoId,
      autorId: null,
      nota: 5,
      comentario: 'Ótimo atendimento',
      resposta: null,
      respondidoEm: null,
      destaquePositivo: null,
      temMidia: false,
      utilCount: 0,
      createdAt: 1,
    });
    const completeStructured = jest.fn().mockResolvedValue({ sugestaoResposta: 'Obrigado pelo feedback!' });

    const moduleRef = await Test.createTestingModule({
      providers: [
        SuggestAvaliacaoRespostaUsecase,
        { provide: ResolveAccountForUserUsecase, useValue: { execute: jest.fn().mockResolvedValue(accountId) } },
        {
          provide: ESTABELECIMENTO_REPOSITORY,
          useValue: { findAvaliacaoById },
        },
        { provide: LLM_REPOSITORY, useValue: { completeStructured } },
      ],
    }).compile();

    const usecase = moduleRef.get(SuggestAvaliacaoRespostaUsecase);
    const result = await usecase.execute(userId, estabelecimentoId, avaliacaoId, 'amigavel');

    expect(findAvaliacaoById).toHaveBeenCalledWith(estabelecimentoId, accountId, avaliacaoId);
    expect(completeStructured).toHaveBeenCalled();
    expect(result).toEqual({ sugestaoResposta: 'Obrigado pelo feedback!' });
  });

  it('throws NotFound when avaliacao is missing', async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SuggestAvaliacaoRespostaUsecase,
        { provide: ResolveAccountForUserUsecase, useValue: { execute: jest.fn().mockResolvedValue(accountId) } },
        {
          provide: ESTABELECIMENTO_REPOSITORY,
          useValue: { findAvaliacaoById: jest.fn().mockResolvedValue(null) },
        },
        { provide: LLM_REPOSITORY, useValue: { completeStructured: jest.fn() } },
      ],
    }).compile();

    const usecase = moduleRef.get(SuggestAvaliacaoRespostaUsecase);
    await expect(usecase.execute(userId, estabelecimentoId, avaliacaoId)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
