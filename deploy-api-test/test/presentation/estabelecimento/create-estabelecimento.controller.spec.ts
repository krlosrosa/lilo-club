import { Test } from '@nestjs/testing';
import { CreateEstabelecimentoUsecase } from '../../../src/application/usecases/create-estabelecimento.usecase.js';
import { CreateEstabelecimentoController } from '../../../src/presentation/controllers/estabelecimento/create-estabelecimento.controller.js';

const body = {
  nome: 'Loja',
  cidadeId: '11111111-1111-4111-8111-111111111101',
  categoriaId: '22222222-2222-4222-8222-222222222201',
};

const detail = {
  id: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
  accountId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  cidadeId: body.cidadeId,
  categoriaId: body.categoriaId,
  categoriaNome: 'Restaurante',
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

describe('CreateEstabelecimentoController', () => {
  it('delegates to use case with parsed body', async () => {
    const uid = '550e8400-e29b-41d4-a716-446655440000';
    const execute = jest.fn().mockResolvedValue(detail);

    const moduleRef = await Test.createTestingModule({
      controllers: [CreateEstabelecimentoController],
      providers: [{ provide: CreateEstabelecimentoUsecase, useValue: { execute } }],
    }).compile();

    const controller = moduleRef.get(CreateEstabelecimentoController);
    const result = await controller.execute(uid, body);

    expect(execute).toHaveBeenCalledWith(uid, body);
    expect(result).toEqual(detail);
  });
});
