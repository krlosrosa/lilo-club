import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import type { UserRecord } from '../../domain/model/user.model.js';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../domain/repositories/user.repository.js';
import { GetAuthMeUsecase } from './get-auth-me.usecase.js';

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

describe('GetAuthMeUsecase', () => {
  it('returns user when found', async () => {
    const repo: jest.Mocked<UserRepository> = {
      findById: jest.fn().mockResolvedValue(user),
      findByOAuthProvider: jest.fn(),
      findByEmail: jest.fn(),
      createUserWithOAuth: jest.fn(),
      linkOAuthIdentity: jest.fn(),
      updateProfile: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        GetAuthMeUsecase,
        { provide: USER_REPOSITORY, useValue: repo },
      ],
    }).compile();

    const usecase = moduleRef.get(GetAuthMeUsecase);
    await expect(usecase.execute(user.id)).resolves.toEqual(user);
  });

  it('throws when user missing', async () => {
    const repo: jest.Mocked<UserRepository> = {
      findById: jest.fn().mockResolvedValue(null),
      findByOAuthProvider: jest.fn(),
      findByEmail: jest.fn(),
      createUserWithOAuth: jest.fn(),
      linkOAuthIdentity: jest.fn(),
      updateProfile: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        GetAuthMeUsecase,
        { provide: USER_REPOSITORY, useValue: repo },
      ],
    }).compile();

    const usecase = moduleRef.get(GetAuthMeUsecase);
    await expect(usecase.execute('missing-id')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
