import { randomUUID } from 'node:crypto';
import { accounts, accountsUsers, subscriptions } from '../providers/drizzle/config/migrations/index.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';
import { findMembershipByUserIdDb } from './find-membership-by-user-id.drizzle.js';

export async function ensureBootstrapAccountDb(
  db: DrizzleClient,
  params: {
    userId: string;
    accountNome: string;
    planFreeId: string;
  },
): Promise<{ accountId: string; created: boolean }> {
  const existing = await findMembershipByUserIdDb(db, params.userId);
  if (existing) {
    return { accountId: existing.account.id, created: false };
  }

  const accountId = randomUUID();
  const membershipId = randomUUID();
  const subscriptionId = randomUUID();
  const now = Date.now();

  db.transaction((tx) => {
    tx
      .insert(accounts)
      .values({
        id: accountId,
        nome: params.accountNome,
        slug: null,
        stripeCustomerId: null,
        createdAt: now,
        updatedAt: now,
      })
      .run();
    tx
      .insert(accountsUsers)
      .values({
        id: membershipId,
        accountId,
        userId: params.userId,
        role: 'owner',
        createdAt: now,
      })
      .run();
    tx
      .insert(subscriptions)
      .values({
        id: subscriptionId,
        accountId,
        planId: params.planFreeId,
        status: 'active',
        providerSubscriptionId: null,
        currentPeriodStart: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        createdAt: now,
      })
      .run();
  });

  return { accountId, created: true };
}
