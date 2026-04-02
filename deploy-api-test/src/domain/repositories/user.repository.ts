import type { TipoUsuarioPerfil } from '../model/guia.enums.js';
import type { UserRecord } from '../model/user.model.js';

export const USER_REPOSITORY = 'IUserRepository';

/** Payload normalizado após OAuth Google (domínio). */
export type GoogleOAuthLinkInput = {
  provider: 'google';
  providerUserId: string;
  email: string;
  nome: string | null;
  avatarUrl: string | null;
};

export type UpdateUserProfileRepoInput = {
  nome?: string | null;
  tipoUsuario?: TipoUsuarioPerfil | null;
};

export interface UserRepository {
  findById(id: string): Promise<UserRecord | null>;
  findByOAuthProvider(
    provider: string,
    providerUserId: string,
  ): Promise<UserRecord | null>;
  findByEmail(email: string): Promise<UserRecord | null>;
  createUserWithOAuth(input: GoogleOAuthLinkInput): Promise<UserRecord>;
  linkOAuthIdentity(userId: string, input: GoogleOAuthLinkInput): Promise<void>;
  updateProfile(userId: string, input: UpdateUserProfileRepoInput): Promise<UserRecord | null>;
}
