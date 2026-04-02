import { eq } from 'drizzle-orm';
import type { AccountMembershipBundle } from '../../../domain/repositories/account.repository.js';
import { accounts, accountsUsers } from '../providers/drizzle/config/migrations/index.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';
import { mapAccountRow, mapMembershipRow } from './map-account-rows.js';

export async function findMembershipByUserIdDb(
  db: DrizzleClient,
  userId: string,
): Promise<AccountMembershipBundle | null> {
  const rows = await db
    .select({ account: accounts, membership: accountsUsers })
    .from(accountsUsers)
    .innerJoin(accounts, eq(accounts.id, accountsUsers.accountId))
    .where(eq(accountsUsers.userId, userId))
    .limit(1);

  const row = rows[0];
  if (!row) return null;
  return {
    account: mapAccountRow(row.account),
    membership: mapMembershipRow(row.membership),
  };
}
