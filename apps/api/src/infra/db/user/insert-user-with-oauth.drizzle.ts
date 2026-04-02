import { eq } from 'drizzle-orm';
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
  // better-sqlite3: callback must be sync and not return a Promise; builders only
  // run when .run() is called (await does not work inside sync tx).
  db.transaction((tx) => {
    tx
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
      .run();
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
  });
  const rows = await db.select().from(users).where(eq(users.id, params.userId)).limit(1);
  const row = rows[0];
  if (!row) throw new Error('User insert failed');
  return mapUserRow(row);
}
