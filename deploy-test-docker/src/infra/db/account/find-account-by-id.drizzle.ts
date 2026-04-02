import { eq } from 'drizzle-orm';
import type { AccountRecord } from '../../../domain/model/account-saas.model.js';
import { accounts } from '../providers/drizzle/config/migrations/index.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';
import { mapAccountRow } from './map-account-rows.js';

export async function findAccountByIdDb(
  db: DrizzleClient,
  id: string,
): Promise<AccountRecord | null> {
  const rows = await db.select().from(accounts).where(eq(accounts.id, id)).limit(1);
  const row = rows[0];
  if (!row) return null;
  return mapAccountRow(row);
}
