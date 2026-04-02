import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UploadEstabelecimentoMidiaUsecase } from './upload-estabelecimento-midia.usecase.js';
import { ResolveAccountForUserUsecase } from './resolve-account-for-user.usecase.js';
import {
  ESTABELECIMENTO_REPOSITORY,
  type EstabelecimentoRepository,
} from '../../domain/repositories/estabelecimento.repository.js';
import {
  ACCOUNT_REPOSITORY,
  type AccountRepository,
} from '../../domain/repositories/account.repository.js';
import {
  IMAGE_STORAGE_REPOSITORY,
  type ImageStorageRepository,
} from '../../domain/repositories/image-storage.repository.js';

describe('UploadEstabelecimentoMidiaUsecase', () => {
  it('throws when midia limit reached', async () => {
    const resolveAccount = {
      execute: jest.fn().mockResolvedValue('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
    };

    const estabelecimentos: jest.Mocked<
      Pick<
        EstabelecimentoRepository,
        'findByIdAndAccount' | 'countMidias' | 'insertMidia'
      >
    > = {
      findByIdAndAccount: jest.fn().mockResolvedValue({
        id: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
        accountId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        cidadeId: '11111111-1111-4111-8111-111111111101',
        categoriaId: '22222222-2222-4222-8222-222222222201',
        nome: 'X',
        slug: null,
        descricao: null,
        conteudoSemantico: null,
        pesoDestaque: 0,
        status: 'rascunho',
        publicado: false,
        destaque: false,
        scoreMedio: null,
        totalAvaliacoes: 0,
        codigoPublico: null,
        createdByUserId: null,
        createdAt: 1,
        updatedAt: 1,
      }),
      countMidias: jest.fn().mockResolvedValue(5),
      insertMidia: jest.fn(),
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
        maxEstabelecimentos: 10,
        maxMidiasPorEstabelecimento: 5,
        seloPremium: false,
        ordem: 1,
        createdAt: 1,
      }),
    };

    const storage: jest.Mocked<Pick<ImageStorageRepository, 'putObject' | 'getPublicUrl'>> =
      {
        putObject: jest.fn(),
        getPublicUrl: jest.fn().mockReturnValue('https://pub/x'),
      };

    const moduleRef = await Test.createTestingModule({
      providers: [
        UploadEstabelecimentoMidiaUsecase,
        { provide: ResolveAccountForUserUsecase, useValue: resolveAccount },
        { provide: ESTABELECIMENTO_REPOSITORY, useValue: estabelecimentos },
        { provide: ACCOUNT_REPOSITORY, useValue: accounts },
        { provide: IMAGE_STORAGE_REPOSITORY, useValue: storage },
      ],
    }).compile();

    const usecase = moduleRef.get(UploadEstabelecimentoMidiaUsecase);
    await expect(
      usecase.execute({
        userId: 'uuuuuuuu-uuuu-4uuu-8uuu-uuuuuuuuuuuu',
        estabelecimentoId: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
        tipoRaw: 'galeria',
        buffer: Buffer.from('x'),
        contentType: 'image/png',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(storage.putObject).not.toHaveBeenCalled();
    expect(estabelecimentos.insertMidia).not.toHaveBeenCalled();
  });
});
