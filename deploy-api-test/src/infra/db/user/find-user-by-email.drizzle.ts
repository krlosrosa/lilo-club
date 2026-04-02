import { eq } from 'drizzle-orm';
import type { UserRecord } from '../../../domain/model/user.model.js';
import { users } from '../providers/drizzle/config/migrations/index.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';
import { mapUserRow } from './map-user-row.js';

export async function findUserByEmailDb(
  db: DrizzleClient,
  email: string,
): Promise<UserRecord | null> {
  const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
  const row = rows[0];
  if (!row) return null;
  return mapUserRow(row);
}
