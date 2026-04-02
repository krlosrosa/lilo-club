import { Test } from '@nestjs/testing';
import { UploadEstabelecimentoMidiaUsecase } from '../../../src/application/usecases/upload-estabelecimento-midia.usecase.js';
import { UploadEstabelecimentoMidiaController } from '../../../src/presentation/controllers/estabelecimento/upload-estabelecimento-midia.controller.js';

describe('UploadEstabelecimentoMidiaController', () => {
  const uid = '550e8400-e29b-41d4-a716-446655440000';
  const eid = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee';

  it('throws when file missing', async () => {
    const execute = jest.fn();
    const moduleRef = await Test.createTestingModule({
      controllers: [UploadEstabelecimentoMidiaController],
      providers: [{ provide: UploadEstabelecimentoMidiaUsecase, useValue: { execute } }],
    }).compile();

    const controller = moduleRef.get(UploadEstabelecimentoMidiaController);
    expect(() => controller.execute(uid, eid, undefined, 'galeria')).toThrow('Arquivo obrigatório');
    expect(execute).not.toHaveBeenCalled();
  });

  it('delegates with buffer and tipo', async () => {
    const response = {
      id: 'mmmmmmmm-mmmm-4mmm-8mmm-mmmmmmmmmmmm',
      estabelecimentoId: eid,
      tipo: 'galeria' as const,
      urlPublica: 'https://example/x.png',
      ordem: 0,
      createdAt: 1,
    };
    const execute = jest.fn().mockResolvedValue(response);

    const moduleRef = await Test.createTestingModule({
      controllers: [UploadEstabelecimentoMidiaController],
      providers: [{ provide: UploadEstabelecimentoMidiaUsecase, useValue: { execute } }],
    }).compile();

    const controller = moduleRef.get(UploadEstabelecimentoMidiaController);
    const file = {
      buffer: Buffer.from('x'),
      mimetype: 'image/png',
    } as Express.Multer.File;

    const result = await controller.execute(uid, eid, file, 'galeria');

    expect(execute).toHaveBeenCalledWith({
      userId: uid,
      estabelecimentoId: eid,
      tipoRaw: 'galeria',
      buffer: file.buffer,
      contentType: 'image/png',
    });
    expect(result).toEqual(response);
  });
});
