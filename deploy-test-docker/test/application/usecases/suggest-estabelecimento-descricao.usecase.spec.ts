import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { SuggestEstabelecimentoDescricaoUsecase } from '../../../src/application/usecases/suggest-estabelecimento-descricao.usecase.js';
import { ResolveAccountForUserUsecase } from '../../../src/application/usecases/resolve-account-for-user.usecase.js';
import { ESTABELECIMENTO_REPOSITORY } from '../../../src/domain/repositories/estabelecimento.repository.js';
import { LLM_REPOSITORY } from '../../../src/domain/repositories/llm.repository.js';

describe('SuggestEstabelecimentoDescricaoUsecase', () => {
  const userId = '550e8400-e29b-41d4-a716-446655440000';
  const estabelecimentoId = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee';
  const accountId = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
  const categoriaId = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';

  const estabelecimentoRow = {
    id: estabelecimentoId,
    accountId,
    cidadeId: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
    categoriaId,
    nome: 'Padaria do Zé',
    slug: null,
    descricao: 'Texto antigo',
    conteudoSemantico: null,
    pesoDestaque: 0,
    status: 'publicado' as const,
    publicado: true,
    destaque: false,
    scoreMedio: null,
    totalAvaliacoes: 0,
    codigoPublico: null,
    createdByUserId: null,
    createdAt: 1,
    updatedAt: 1,
  };

  it('returns parsed suggestion when estabelecimento exists and LLM returns valid JSON', async () => {
    const findByIdAndAccount = jest.fn().mockResolvedValue(estabelecimentoRow);
    const findCategoriaNome = jest.fn().mockResolvedValue('Padaria');
    const completeStructured = jest.fn().mockResolvedValue({
      descricaoSugerida: 'Descrição melhorada para o guia.',
    });

    const moduleRef = await Test.createTestingModule({
      providers: [
        SuggestEstabelecimentoDescricaoUsecase,
        { provide: ResolveAccountForUserUsecase, useValue: { execute: jest.fn().mockResolvedValue(accountId) } },
        {
          provide: ESTABELECIMENTO_REPOSITORY,
          useValue: { findByIdAndAccount, findCategoriaNome },
        },
        { provide: LLM_REPOSITORY, useValue: { completeStructured } },
      ],
    }).compile();

    const usecase = moduleRef.get(SuggestEstabelecimentoDescricaoUsecase);
    const result = await usecase.execute(userId, estabelecimentoId, '  Rascunho curto  ');

    expect(findByIdAndAccount).toHaveBeenCalledWith(estabelecimentoId, accountId);
    expect(findCategoriaNome).toHaveBeenCalledWith(categoriaId);
    expect(completeStructured).toHaveBeenCalled();
    expect(result).toEqual({ descricaoSugerida: 'Descrição melhorada para o guia.' });
  });

  it('throws NotFound when estabelecimento is missing', async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SuggestEstabelecimentoDescricaoUsecase,
        { provide: ResolveAccountForUserUsecase, useValue: { execute: jest.fn().mockResolvedValue(accountId) } },
        {
          provide: ESTABELECIMENTO_REPOSITORY,
          useValue: {
            findByIdAndAccount: jest.fn().mockResolvedValue(null),
            findCategoriaNome: jest.fn(),
          },
        },
        { provide: LLM_REPOSITORY, useValue: { completeStructured: jest.fn() } },
      ],
    }).compile();

    const usecase = moduleRef.get(SuggestEstabelecimentoDescricaoUsecase);
    await expect(usecase.execute(userId, estabelecimentoId, 'algum texto')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('throws BadRequest when rascunho is empty or whitespace', async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SuggestEstabelecimentoDescricaoUsecase,
        { provide: ResolveAccountForUserUsecase, useValue: { execute: jest.fn().mockResolvedValue(accountId) } },
        {
          provide: ESTABELECIMENTO_REPOSITORY,
          useValue: {
            findByIdAndAccount: jest.fn(),
            findCategoriaNome: jest.fn(),
          },
        },
        { provide: LLM_REPOSITORY, useValue: { completeStructured: jest.fn() } },
      ],
    }).compile();

    const usecase = moduleRef.get(SuggestEstabelecimentoDescricaoUsecase);
    await expect(usecase.execute(userId, estabelecimentoId, '')).rejects.toBeInstanceOf(BadRequestException);
    await expect(usecase.execute(userId, estabelecimentoId, '   \n')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
