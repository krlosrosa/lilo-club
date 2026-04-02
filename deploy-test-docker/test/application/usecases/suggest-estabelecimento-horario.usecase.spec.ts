import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { SuggestEstabelecimentoHorarioUsecase } from '../../../src/application/usecases/suggest-estabelecimento-horario.usecase.js';
import { ResolveAccountForUserUsecase } from '../../../src/application/usecases/resolve-account-for-user.usecase.js';
import { ESTABELECIMENTO_REPOSITORY } from '../../../src/domain/repositories/estabelecimento.repository.js';
import { LLM_REPOSITORY } from '../../../src/domain/repositories/llm.repository.js';

describe('SuggestEstabelecimentoHorarioUsecase', () => {
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
    descricao: null,
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

  it('returns normalized intervalos when LLM returns valid slots', async () => {
    const findByIdAndAccount = jest.fn().mockResolvedValue(estabelecimentoRow);
    const completeStructured = jest.fn().mockResolvedValue({
      intervalos: [
        { diaSemana: 5, abre: '08:00', fecha: '17:00' },
        { diaSemana: 1, abre: '08:00', fecha: '18:00' },
        { diaSemana: 1, abre: '08:00', fecha: '12:00' },
      ],
    });

    const moduleRef = await Test.createTestingModule({
      providers: [
        SuggestEstabelecimentoHorarioUsecase,
        { provide: ResolveAccountForUserUsecase, useValue: { execute: jest.fn().mockResolvedValue(accountId) } },
        {
          provide: ESTABELECIMENTO_REPOSITORY,
          useValue: { findByIdAndAccount },
        },
        { provide: LLM_REPOSITORY, useValue: { completeStructured } },
      ],
    }).compile();

    const usecase = moduleRef.get(SuggestEstabelecimentoHorarioUsecase);
    const result = await usecase.execute(userId, estabelecimentoId, 'seg a sex');

    expect(findByIdAndAccount).toHaveBeenCalledWith(estabelecimentoId, accountId);
    expect(completeStructured).toHaveBeenCalled();
    expect(result.intervalos).toEqual([
      { diaSemana: 1, ordem: 0, abre: '08:00', fecha: '18:00' },
      { diaSemana: 1, ordem: 1, abre: '08:00', fecha: '12:00' },
      { diaSemana: 5, ordem: 0, abre: '08:00', fecha: '17:00' },
    ]);
  });

  it('throws NotFound when estabelecimento is missing', async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SuggestEstabelecimentoHorarioUsecase,
        { provide: ResolveAccountForUserUsecase, useValue: { execute: jest.fn().mockResolvedValue(accountId) } },
        {
          provide: ESTABELECIMENTO_REPOSITORY,
          useValue: { findByIdAndAccount: jest.fn().mockResolvedValue(null) },
        },
        { provide: LLM_REPOSITORY, useValue: { completeStructured: jest.fn() } },
      ],
    }).compile();

    const usecase = moduleRef.get(SuggestEstabelecimentoHorarioUsecase);
    await expect(usecase.execute(userId, estabelecimentoId, 'texto')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('throws BadRequest when texto is empty or whitespace', async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SuggestEstabelecimentoHorarioUsecase,
        { provide: ResolveAccountForUserUsecase, useValue: { execute: jest.fn().mockResolvedValue(accountId) } },
        {
          provide: ESTABELECIMENTO_REPOSITORY,
          useValue: { findByIdAndAccount: jest.fn() },
        },
        { provide: LLM_REPOSITORY, useValue: { completeStructured: jest.fn() } },
      ],
    }).compile();

    const usecase = moduleRef.get(SuggestEstabelecimentoHorarioUsecase);
    await expect(usecase.execute(userId, estabelecimentoId, '')).rejects.toBeInstanceOf(BadRequestException);
    await expect(usecase.execute(userId, estabelecimentoId, '   \n')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('throws BadRequest when abre is not before fecha', async () => {
    const findByIdAndAccount = jest.fn().mockResolvedValue(estabelecimentoRow);
    const completeStructured = jest.fn().mockResolvedValue({
      intervalos: [{ diaSemana: 1, abre: '18:00', fecha: '08:00' }],
    });

    const moduleRef = await Test.createTestingModule({
      providers: [
        SuggestEstabelecimentoHorarioUsecase,
        { provide: ResolveAccountForUserUsecase, useValue: { execute: jest.fn().mockResolvedValue(accountId) } },
        {
          provide: ESTABELECIMENTO_REPOSITORY,
          useValue: { findByIdAndAccount },
        },
        { provide: LLM_REPOSITORY, useValue: { completeStructured } },
      ],
    }).compile();

    const usecase = moduleRef.get(SuggestEstabelecimentoHorarioUsecase);
    await expect(usecase.execute(userId, estabelecimentoId, 'horários')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('throws BadRequest when LLM returns invalid shape', async () => {
    const findByIdAndAccount = jest.fn().mockResolvedValue(estabelecimentoRow);
    const completeStructured = jest.fn().mockResolvedValue({
      intervalos: [{ diaSemana: 1, abre: '25:00', fecha: '08:00' }],
    });

    const moduleRef = await Test.createTestingModule({
      providers: [
        SuggestEstabelecimentoHorarioUsecase,
        { provide: ResolveAccountForUserUsecase, useValue: { execute: jest.fn().mockResolvedValue(accountId) } },
        {
          provide: ESTABELECIMENTO_REPOSITORY,
          useValue: { findByIdAndAccount },
        },
        { provide: LLM_REPOSITORY, useValue: { completeStructured } },
      ],
    }).compile();

    const usecase = moduleRef.get(SuggestEstabelecimentoHorarioUsecase);
    await expect(usecase.execute(userId, estabelecimentoId, 'horários')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
