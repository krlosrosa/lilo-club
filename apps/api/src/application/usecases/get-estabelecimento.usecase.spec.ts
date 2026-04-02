import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GetEstabelecimentoUsecase } from './get-estabelecimento.usecase.js';
import { ResolveAccountForUserUsecase } from './resolve-account-for-user.usecase.js';
import {
  ESTABELECIMENTO_REPOSITORY,
  type EstabelecimentoRepository,
} from '../../domain/repositories/estabelecimento.repository.js';

describe('GetEstabelecimentoUsecase (posse)', () => {
  it('throws NotFound when estabelecimento não pertence à conta', async () => {
    const resolveAccount = { execute: jest.fn().mockResolvedValue('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa') };
    const estabelecimentos: jest.Mocked<
      Pick<EstabelecimentoRepository, 'findByIdAndAccount' | 'findCategoriaNome'>
    > = {
      findByIdAndAccount: jest.fn().mockResolvedValue(null),
      findCategoriaNome: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        GetEstabelecimentoUsecase,
        { provide: ResolveAccountForUserUsecase, useValue: resolveAccount },
        { provide: ESTABELECIMENTO_REPOSITORY, useValue: estabelecimentos },
      ],
    }).compile();

    const usecase = moduleRef.get(GetEstabelecimentoUsecase);
    await expect(
      usecase.execute('user-1', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(estabelecimentos.findCategoriaNome).not.toHaveBeenCalled();
  });
});
