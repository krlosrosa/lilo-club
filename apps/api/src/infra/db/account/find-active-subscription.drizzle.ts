import { and, desc, eq, inArray } from 'drizzle-orm';
import type { SubscriptionRecord } from '../../../domain/model/account-saas.model.js';
import { subscriptions } from '../providers/drizzle/config/migrations/index.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';
import { mapSubscriptionRow } from './map-account-rows.js';

export async function findActiveSubscriptionDb(
  db: DrizzleClient,
  accountId: string,
): Promise<SubscriptionRecord | null> {
  const rows = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.accountId, accountId),
        inArray(subscriptions.status, ['active', 'trialing']),
      ),
    )
    .orderBy(desc(subscriptions.createdAt))
    .limit(1);

  const row = rows[0];
  if (!row) return null;
  return mapSubscriptionRow(row);
}
