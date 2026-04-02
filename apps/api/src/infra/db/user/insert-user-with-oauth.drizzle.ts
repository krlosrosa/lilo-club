import type { UserRecord } from '../../../domain/model/user.model.js';
import { oauthIdentities, users } from '../providers/drizzle/config/migrations/index.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';
import { mapUserRow } from './map-user-row.js';

export async function insertUserWithOAuthDb(
  db: DrizzleClient,
  params: {
    userId: string;
    oauthIdentityId: string;
    email: string;
    nome: string | null;
    avatarUrl: string | null;
    provider: string;
    providerUserId: string;
    createdAt: number;
  },
): Promise<UserRecord> {
  // better-sqlite3: tx callback must be sync; statements must use .run() / .all().
  // Use RETURNING inside the same transaction so we never depend on a second SELECT
  // seeing committed data (avoids empty reads after a successful insert).
  const row = db.transaction((tx) => {
    const inserted = tx
      .insert(users)
      .values({
        id: params.userId,
        email: params.email,
        nome: params.nome,
        telefone: null,
        avatarUrl: params.avatarUrl,
        tipoUsuario: null,
        platformRole: 'none',
        createdAt: params.createdAt,
      })
      .returning()
      .all();
    tx
      .insert(oauthIdentities)
      .values({
        id: params.oauthIdentityId,
        provider: params.provider,
        providerUserId: params.providerUserId,
        userId: params.userId,
        createdAt: params.createdAt,
      })
      .run();
    return inserted[0];
  });
  if (!row) throw new Error('User insert failed');
  return mapUserRow(row);
}
