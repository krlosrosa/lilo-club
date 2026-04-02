import { eq } from 'drizzle-orm';
import type { AccountUserRecord } from '../../../domain/model/account-saas.model.js';
import { accountsUsers } from '../providers/drizzle/config/migrations/index.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';
import { mapMembershipRow } from './map-account-rows.js';

export async function listAccountMembersDb(
  db: DrizzleClient,
  accountId: string,
): Promise<AccountUserRecord[]> {
  const rows = await db
    .select()
    .from(accountsUsers)
    .where(eq(accountsUsers.accountId, accountId));
  return rows.map(mapMembershipRow);
}
