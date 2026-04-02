import { Test } from '@nestjs/testing';
import { SuggestAvaliacaoRespostaUsecase } from '../../../src/application/usecases/suggest-avaliacao-resposta.usecase.js';
import { PostSuggestAvaliacaoRespostaController } from '../../../src/presentation/controllers/estabelecimento/post-suggest-avaliacao-resposta.controller.js';

describe('PostSuggestAvaliacaoRespostaController', () => {
  it('delegates to use case with parsed tom', async () => {
    const uid = '550e8400-e29b-41d4-a716-446655440000';
    const eid = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee';
    const aid = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
    const payload = { sugestaoResposta: 'Oi!' };

    const execute = jest.fn().mockResolvedValue(payload);

    const moduleRef = await Test.createTestingModule({
      controllers: [PostSuggestAvaliacaoRespostaController],
      providers: [{ provide: SuggestAvaliacaoRespostaUsecase, useValue: { execute } }],
    }).compile();

    const controller = moduleRef.get(PostSuggestAvaliacaoRespostaController);
    const result = await controller.execute(uid, eid, aid, {  });

    expect(execute).toHaveBeenCalledWith(uid, eid, aid, undefined);
    expect(result).toEqual(payload);

    await controller.execute(uid, eid, aid, { tom: 'formal' });
    expect(execute).toHaveBeenLastCalledWith(uid, eid, aid, 'formal');
  });
});
