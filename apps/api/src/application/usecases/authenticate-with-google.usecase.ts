import { Inject, Injectable } from '@nestjs/common';
import type { UserRecord } from '../../domain/model/user.model.js';
import type { GoogleOAuthLinkInput } from '../../domain/repositories/user.repository.js';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../../domain/repositories/user.repository.js';

@Injectable()
export class AuthenticateWithGoogleUsecase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
  ) {}

  async execute(input: GoogleOAuthLinkInput): Promise<UserRecord> {
    const normalized = {
      ...input,
      email: input.email.trim().toLowerCase(),
    };

    const existingOAuth = await this.users.findByOAuthProvider(
      normalized.provider,
      normalized.providerUserId,
    );
    if (existingOAuth) return existingOAuth;

    const byEmail = await this.users.findByEmail(normalized.email);
    if (byEmail) {
      await this.users.linkOAuthIdentity(byEmail.id, normalized);
      const linked = await this.users.findByOAuthProvider(
        normalized.provider,
        normalized.providerUserId,
      );
      if (!linked) {
        throw new Error('OAuth identity link failed');
      }
      return linked;
    }

    return this.users.createUserWithOAuth(normalized);
  }
}
