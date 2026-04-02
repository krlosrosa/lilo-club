import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { UserRecord } from '../../../domain/model/user.model.js';
import type {
  GoogleOAuthLinkInput,
  UpdateUserProfileRepoInput,
  UserRepository,
} from '../../../domain/repositories/user.repository.js';
import { DRIZZLE_PROVIDER } from '../providers/drizzle/drizzle.constants.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';
import { findUserByEmailDb } from './find-user-by-email.drizzle.js';
import { findUserByIdDb } from './find-user-by-id.drizzle.js';
import { findUserByOAuthProviderDb } from './find-user-by-oauth.drizzle.js';
import { linkOAuthIdentityDb } from './insert-oauth-identity.drizzle.js';
import { insertUserWithOAuthDb } from './insert-user-with-oauth.drizzle.js';
import { updateUserProfileDb } from './update-user-profile.drizzle.js';

@Injectable()
export class UserRepositoryService implements UserRepository {
  constructor(@Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient) {}

  findById(id: string): Promise<UserRecord | null> {
    return findUserByIdDb(this.db, id);
  }

  findByOAuthProvider(
    provider: string,
    providerUserId: string,
  ): Promise<UserRecord | null> {
    return findUserByOAuthProviderDb(this.db, provider, providerUserId);
  }

  findByEmail(email: string): Promise<UserRecord | null> {
    return findUserByEmailDb(this.db, email);
  }

  async createUserWithOAuth(input: GoogleOAuthLinkInput): Promise<UserRecord> {
    const now = Date.now();
    const userId = randomUUID();
    const oauthIdentityId = randomUUID();
    return insertUserWithOAuthDb(this.db, {
      userId,
      oauthIdentityId,
      email: input.email,
      nome: input.nome,
      avatarUrl: input.avatarUrl,
      provider: input.provider,
      providerUserId: input.providerUserId,
      createdAt: now,
    });
  }

  async linkOAuthIdentity(
    userId: string,
    input: GoogleOAuthLinkInput,
  ): Promise<void> {
    const now = Date.now();
    await linkOAuthIdentityDb(this.db, {
      oauthIdentityId: randomUUID(),
      userId,
      provider: input.provider,
      providerUserId: input.providerUserId,
      nome: input.nome,
      avatarUrl: input.avatarUrl,
      createdAt: now,
    });
  }

  updateProfile(
    userId: string,
    input: UpdateUserProfileRepoInput,
  ): Promise<UserRecord | null> {
    return updateUserProfileDb(this.db, userId, input);
  }
}
