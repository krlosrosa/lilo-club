import { and, eq } from 'drizzle-orm';
import type { UserRecord } from '../../../domain/model/user.model.js';
import { oauthIdentities, users } from '../providers/drizzle/config/migrations/index.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';
import { mapUserRow } from './map-user-row.js';

export async function findUserByOAuthProviderDb(
  db: DrizzleClient,
  provider: string,
  providerUserId: string,
): Promise<UserRecord | null> {
  const rows = await db
    .select({ u: users })
    .from(oauthIdentities)
    .innerJoin(users, eq(oauthIdentities.userId, users.id))
    .where(
      and(
        eq(oauthIdentities.provider, provider),
        eq(oauthIdentities.providerUserId, providerUserId),
      ),
    )
    .limit(1);
  const first = rows[0];
  if (!first) return null;
  return mapUserRow(first.u);
}
