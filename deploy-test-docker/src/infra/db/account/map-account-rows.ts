import type { InferSelectModel } from 'drizzle-orm';
import {
  accountRecordSchema,
  accountUserRecordSchema,
  planRecordSchema,
  subscriptionRecordSchema,
  type AccountRecord,
  type AccountUserRecord,
  type PlanRecord,
  type SubscriptionRecord,
} from '../../../domain/model/account-saas.model.js';
import {
  accounts,
  accountsUsers,
  plans,
  subscriptions,
} from '../providers/drizzle/config/migrations/index.js';

export function mapAccountRow(row: InferSelectModel<typeof accounts>): AccountRecord {
  return accountRecordSchema.parse({
    id: row.id,
    nome: row.nome,
    slug: row.slug ?? null,
    stripeCustomerId: row.stripeCustomerId ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

export function mapMembershipRow(
  row: InferSelectModel<typeof accountsUsers>,
): AccountUserRecord {
  return accountUserRecordSchema.parse({
    id: row.id,
    accountId: row.accountId,
    userId: row.userId,
    role: row.role,
    createdAt: row.createdAt,
  });
}

export function mapPlanRow(row: InferSelectModel<typeof plans>): PlanRecord {
  return planRecordSchema.parse({
    id: row.id,
    slug: row.slug,
    nome: row.nome,
    maxEstabelecimentos: row.maxEstabelecimentos,
    maxMidiasPorEstabelecimento: row.maxMidiasPorEstabelecimento ?? null,
    seloPremium: row.seloPremium,
    ordem: row.ordem,
    createdAt: row.createdAt,
  });
}

export function mapSubscriptionRow(
  row: InferSelectModel<typeof subscriptions>,
): SubscriptionRecord {
  return subscriptionRecordSchema.parse({
    id: row.id,
    accountId: row.accountId,
    planId: row.planId,
    status: row.status,
    providerSubscriptionId: row.providerSubscriptionId ?? null,
    currentPeriodStart: row.currentPeriodStart ?? null,
    currentPeriodEnd: row.currentPeriodEnd ?? null,
    cancelAtPeriodEnd: row.cancelAtPeriodEnd ?? null,
    createdAt: row.createdAt,
  });
}
