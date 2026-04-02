import { Test } from '@nestjs/testing';
import { GetEstabelecimentoUsecase } from '../../../src/application/usecases/get-estabelecimento.usecase.js';
import { GetEstabelecimentoController } from '../../../src/presentation/controllers/estabelecimento/get-estabelecimento.controller.js';

describe('GetEstabelecimentoController', () => {
  it('delegates to use case with user id and estabelecimento id', async () => {
    const uid = '550e8400-e29b-41d4-a716-446655440000';
    const eid = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee';
    const detail = {
      id: eid,
      accountId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      cidadeId: '11111111-1111-4111-8111-111111111101',
      categoriaId: '22222222-2222-4222-8222-222222222201',
      categoriaNome: 'X',
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
      createdAt: 1,
      updatedAt: 1,
    };

    const execute = jest.fn().mockResolvedValue(detail);

    const moduleRef = await Test.createTestingModule({
      controllers: [GetEstabelecimentoController],
      providers: [{ provide: GetEstabelecimentoUsecase, useValue: { execute } }],
    }).compile();

    const controller = moduleRef.get(GetEstabelecimentoController);
    const result = await controller.execute(uid, eid);

    expect(execute).toHaveBeenCalledWith(uid, eid);
    expect(result).toEqual(detail);
  });
});
