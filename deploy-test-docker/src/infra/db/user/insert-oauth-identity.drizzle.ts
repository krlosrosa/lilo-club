import { eq } from 'drizzle-orm';
import { oauthIdentities, users } from '../providers/drizzle/config/migrations/index.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';

export async function linkOAuthIdentityDb(
  db: DrizzleClient,
  params: {
    oauthIdentityId: string;
    userId: string;
    provider: string;
    providerUserId: string;
    nome: string | null;
    avatarUrl: string | null;
    createdAt: number;
  },
): Promise<void> {
  db.transaction((tx) => {
    tx.insert(oauthIdentities).values({
      id: params.oauthIdentityId,
      userId: params.userId,
      provider: params.provider,
      providerUserId: params.providerUserId,
      createdAt: params.createdAt,
    });
    tx.update(users)
      .set({ nome: params.nome, avatarUrl: params.avatarUrl })
      .where(eq(users.id, params.userId));
  });
}
