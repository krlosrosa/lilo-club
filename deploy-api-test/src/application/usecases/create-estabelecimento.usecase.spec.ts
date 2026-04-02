import { Test } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { CreateEstabelecimentoUsecase } from './create-estabelecimento.usecase.js';
import { ResolveAccountForUserUsecase } from './resolve-account-for-user.usecase.js';
import {
  ESTABELECIMENTO_REPOSITORY,
  type EstabelecimentoRepository,
} from '../../domain/repositories/estabelecimento.repository.js';
import {
  ACCOUNT_REPOSITORY,
  type AccountRepository,
} from '../../domain/repositories/account.repository.js';
import { DRIZZLE_PROVIDER } from '../../infra/db/providers/drizzle/drizzle.constants.js';
import * as cidadeCheck from '../../infra/db/catalog/verify-cidade-exists.drizzle.js';
import * as catCheck from '../../infra/db/catalog/verify-categoria-exists.drizzle.js';

describe('CreateEstabelecimentoUsecase', () => {
  beforeEach(() => {
    jest.spyOn(cidadeCheck, 'verifyCidadeExistsDb').mockResolvedValue(true);
    jest.spyOn(catCheck, 'verifyCategoriaExistsDb').mockResolvedValue(true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('throws Forbidden when estabelecimento limit reached', async () => {
    const estabelecimentos: jest.Mocked<Pick<EstabelecimentoRepository, 'countByAccount' | 'create'>> = {
      countByAccount: jest.fn().mockResolvedValue(3),
      create: jest.fn(),
    };

    const accounts: jest.Mocked<
      Pick<AccountRepository, 'findActiveSubscription' | 'findPlanById'>
    > = {
      findActiveSubscription: jest.fn().mockResolvedValue({
        id: 'ssssssss-ssss-4sss-8sss-ssssssssssss',
        accountId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        planId: 'pppppppp-pppp-4ppp-8ppp-pppppppppppp',
        status: 'active',
        providerSubscriptionId: null,
        currentPeriodStart: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: null,
        createdAt: 1,
      }),
      findPlanById: jest.fn().mockResolvedValue({
        id: 'pppppppp-pppp-4ppp-8ppp-pppppppppppp',
        slug: 'free',
        nome: 'Free',
        maxEstabelecimentos: 3,
        maxMidiasPorEstabelecimento: 5,
        seloPremium: false,
        ordem: 1,
        createdAt: 1,
      }),
    };

    const resolveAccount = {
      execute: jest.fn().mockResolvedValue('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateEstabelecimentoUsecase,
        { provide: ResolveAccountForUserUsecase, useValue: resolveAccount },
        { provide: ESTABELECIMENTO_REPOSITORY, useValue: estabelecimentos },
        { provide: ACCOUNT_REPOSITORY, useValue: accounts },
        { provide: DRIZZLE_PROVIDER, useValue: {} },
      ],
    }).compile();

    const usecase = moduleRef.get(CreateEstabelecimentoUsecase);
    await expect(
      usecase.execute('user-1', {
        nome: 'Loja',
        cidadeId: '11111111-1111-4111-8111-111111111101',
        categoriaId: '22222222-2222-4222-8222-222222222201',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(estabelecimentos.create).not.toHaveBeenCalled();
  });

  it('creates when under limit', async () => {
    const created = {
      id: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
      accountId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      cidadeId: '11111111-1111-4111-8111-111111111101',
      categoriaId: '22222222-2222-4222-8222-222222222201',
      nome: 'Loja',
      slug: null,
      descricao: null,
      conteudoSemantico: null,
      pesoDestaque: 0,
      status: 'rascunho' as const,
      publicado: false,
      destaque: false,
      scoreMedio: null,
      totalAvaliacoes: 0,
      codigoPublico: null,
      createdByUserId: 'user-1',
      createdAt: 1,
      updatedAt: 1,
    };

    const estabelecimentos: jest.Mocked<
      Pick<EstabelecimentoRepository, 'countByAccount' | 'create' | 'findCategoriaNome'>
    > = {
      countByAccount: jest.fn().mockResolvedValue(0),
      create: jest.fn().mockResolvedValue(created),
      findCategoriaNome: jest.fn().mockResolvedValue('Restaurante'),
    };

    const accounts: jest.Mocked<
      Pick<AccountRepository, 'findActiveSubscription' | 'findPlanById'>
    > = {
      findActiveSubscription: jest.fn().mockResolvedValue({
        id: 'ssssssss-ssss-4sss-8sss-ssssssssssss',
        accountId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        planId: 'pppppppp-pppp-4ppp-8ppp-pppppppppppp',
        status: 'active',
        providerSubscriptionId: null,
        currentPeriodStart: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: null,
        createdAt: 1,
      }),
      findPlanById: jest.fn().mockResolvedValue({
        id: 'pppppppp-pppp-4ppp-8ppp-pppppppppppp',
        slug: 'free',
        nome: 'Free',
        maxEstabelecimentos: 3,
        maxMidiasPorEstabelecimento: 5,
        seloPremium: false,
        ordem: 1,
        createdAt: 1,
      }),
    };

    const resolveAccount = {
      execute: jest.fn().mockResolvedValue('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateEstabelecimentoUsecase,
        { provide: ResolveAccountForUserUsecase, useValue: resolveAccount },
        { provide: ESTABELECIMENTO_REPOSITORY, useValue: estabelecimentos },
        { provide: ACCOUNT_REPOSITORY, useValue: accounts },
        { provide: DRIZZLE_PROVIDER, useValue: {} },
      ],
    }).compile();

    const usecase = moduleRef.get(CreateEstabelecimentoUsecase);
    const result = await usecase.execute('user-1', {
      nome: 'Loja',
      cidadeId: '11111111-1111-4111-8111-111111111101',
      categoriaId: '22222222-2222-4222-8222-222222222201',
    });

    expect(result.nome).toBe('Loja');
    expect(result.categoriaNome).toBe('Restaurante');
    expect(estabelecimentos.create).toHaveBeenCalled();
  });
});
