import { eq } from 'drizzle-orm';
import type { UserRecord } from '../../../domain/model/user.model.js';
import { users } from '../providers/drizzle/config/migrations/index.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';
import { mapUserRow } from './map-user-row.js';

export async function findUserByIdDb(
  db: DrizzleClient,
  id: string,
): Promise<UserRecord | null> {
  const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
  const row = rows[0];
  if (!row) return null;
  return mapUserRow(row);
}
