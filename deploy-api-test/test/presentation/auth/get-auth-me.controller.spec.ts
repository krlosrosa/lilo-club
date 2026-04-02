import { Test } from '@nestjs/testing';
import { GetAuthMeUsecase } from '../../../src/application/usecases/get-auth-me.usecase.js';
import type { UserRecord } from '../../../src/domain/model/user.model.js';
import { GetAuthMeController } from '../../../src/presentation/controllers/auth/get-auth-me.controller.js';

const user: UserRecord = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  email: 'user@example.com',
  nome: 'User',
  telefone: null,
  avatarUrl: null,
  tipoUsuario: null,
  platformRole: 'none',
  createdAt: 1,
};

describe('GetAuthMeController', () => {
  it('delegates to use case with user id', async () => {
    const execute = jest.fn().mockResolvedValue(user);

    const moduleRef = await Test.createTestingModule({
      controllers: [GetAuthMeController],
      providers: [{ provide: GetAuthMeUsecase, useValue: { execute } }],
    }).compile();

    const controller = moduleRef.get(GetAuthMeController);
    const result = await controller.execute(user.id);

    expect(execute).toHaveBeenCalledWith(user.id);
    expect(result).toEqual(user);
  });
});
