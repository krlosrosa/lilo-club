import { pgTable, text, integer, bigint, uniqueIndex, boolean } from 'drizzle-orm/pg-core';
import { users } from './users';

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  nome: text('nome').notNull(),
  slug: text('slug').unique(),
  stripeCustomerId: text('stripe_customer_id'),
  createdAt: bigint('created_at', { mode: 'number' }).notNull(),
  updatedAt: bigint('updated_at', { mode: 'number' }).notNull(),
});

export const accountsUsers = pgTable(
  'accounts_users',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id')
      .notNull()
      .references(() => accounts.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: text('role').notNull(),
    createdAt: bigint('created_at', { mode: 'number' }).notNull(),
  },
  (t) => ({
    uqAccountUser: uniqueIndex('uq_accounts_users_account_user').on(
      t.accountId,
      t.userId,
    ),
  }),
);

export const plans = pgTable('plans', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  nome: text('nome').notNull(),
  maxEstabelecimentos: integer('max_estabelecimentos').notNull(),
  maxMidiasPorEstabelecimento: integer('max_midias_por_estabelecimento'),
  seloPremium: boolean('selo_premium').notNull().default(false),
  ordem: integer('ordem').notNull().default(0),
  createdAt: bigint('created_at', { mode: 'number' }).notNull(),
});

export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey(),
  accountId: text('account_id')
    .notNull()
    .references(() => accounts.id, { onDelete: 'cascade' }),
  planId: text('plan_id')
    .notNull()
    .references(() => plans.id, { onDelete: 'restrict' }),
  status: text('status').notNull(),
  providerSubscriptionId: text('provider_subscription_id'),
  currentPeriodStart: bigint('current_period_start', { mode: 'number' }),
  currentPeriodEnd: bigint('current_period_end', { mode: 'number' }),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  createdAt: bigint('created_at', { mode: 'number' }).notNull(),
});
