import { Test } from '@nestjs/testing';
import { OAUTH_PROVIDER_GOOGLE } from '../../domain/auth.constants.js';
import type { UserRecord } from '../../domain/model/user.model.js';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../domain/repositories/user.repository.js';
import { AuthenticateWithGoogleUsecase } from './authenticate-with-google.usecase.js';

const baseUser: UserRecord = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  email: 'user@example.com',
  nome: 'User',
  telefone: null,
  avatarUrl: null,
  tipoUsuario: null,
  platformRole: 'none',
  createdAt: 1_700_000_000_000,
};

describe('AuthenticateWithGoogleUsecase', () => {
  let usecase: AuthenticateWithGoogleUsecase;
  let repo: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    repo = {
      findById: jest.fn(),
      findByOAuthProvider: jest.fn(),
      findByEmail: jest.fn(),
      createUserWithOAuth: jest.fn(),
      linkOAuthIdentity: jest.fn(),
      updateProfile: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthenticateWithGoogleUsecase,
        { provide: USER_REPOSITORY, useValue: repo },
      ],
    }).compile();

    usecase = moduleRef.get(AuthenticateWithGoogleUsecase);
  });

  it('returns user when OAuth identity already exists', async () => {
    repo.findByOAuthProvider.mockResolvedValue(baseUser);

    const result = await usecase.execute({
      provider: OAUTH_PROVIDER_GOOGLE,
      providerUserId: 'google-sub',
      email: baseUser.email,
      nome: baseUser.nome,
      avatarUrl: baseUser.avatarUrl,
    });

    expect(result).toEqual(baseUser);
    expect(repo.findByEmail).not.toHaveBeenCalled();
    expect(repo.createUserWithOAuth).not.toHaveBeenCalled();
  });

  it('links OAuth when email exists but OAuth is new', async () => {
    repo.findByOAuthProvider.mockResolvedValue(null);
    repo.findByEmail.mockResolvedValue(baseUser);
    repo.findByOAuthProvider
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(baseUser);

    const result = await usecase.execute({
      provider: OAUTH_PROVIDER_GOOGLE,
      providerUserId: 'google-sub',
      email: baseUser.email,
      nome: 'Updated',
      avatarUrl: 'https://x/y.png',
    });

    expect(repo.linkOAuthIdentity).toHaveBeenCalledWith(baseUser.id, {
      provider: OAUTH_PROVIDER_GOOGLE,
      providerUserId: 'google-sub',
      email: baseUser.email,
      nome: 'Updated',
      avatarUrl: 'https://x/y.png',
    });
    expect(result).toEqual(baseUser);
    expect(repo.createUserWithOAuth).not.toHaveBeenCalled();
  });

  it('creates user when no OAuth and no email', async () => {
    const created = { ...baseUser, id: '660e8400-e29b-41d4-a716-446655440001' };
    repo.findByOAuthProvider.mockResolvedValue(null);
    repo.findByEmail.mockResolvedValue(null);
    repo.createUserWithOAuth.mockResolvedValue(created);

    const result = await usecase.execute({
      provider: OAUTH_PROVIDER_GOOGLE,
      providerUserId: 'google-sub',
      email: 'new@example.com',
      nome: 'New',
      avatarUrl: null,
    });

    expect(repo.createUserWithOAuth).toHaveBeenCalled();
    expect(result).toEqual(created);
  });
});
