import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { users } from './users';

export const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  nome: text('nome').notNull(),
  slug: text('slug').unique(),
  stripeCustomerId: text('stripe_customer_id'),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'number' }).notNull(),
});

/** Nome `accounts_users` para ordenação de FK no SQLite (após `accounts`). */
export const accountsUsers = sqliteTable(
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
    createdAt: integer('created_at', { mode: 'number' }).notNull(),
  },
  (t) => ({
    uqAccountUser: uniqueIndex('uq_accounts_users_account_user').on(
      t.accountId,
      t.userId,
    ),
  }),
);

export const plans = sqliteTable('plans', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  nome: text('nome').notNull(),
  maxEstabelecimentos: integer('max_estabelecimentos', { mode: 'number' }).notNull(),
  maxMidiasPorEstabelecimento: integer('max_midias_por_estabelecimento', {
    mode: 'number',
  }),
  seloPremium: integer('selo_premium', { mode: 'boolean' }).notNull().default(false),
  ordem: integer('ordem', { mode: 'number' }).notNull().default(0),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
});

export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  accountId: text('account_id')
    .notNull()
    .references(() => accounts.id, { onDelete: 'cascade' }),
  planId: text('plan_id')
    .notNull()
    .references(() => plans.id, { onDelete: 'restrict' }),
  status: text('status').notNull(),
  providerSubscriptionId: text('provider_subscription_id'),
  currentPeriodStart: integer('current_period_start', { mode: 'number' }),
  currentPeriodEnd: integer('current_period_end', { mode: 'number' }),
  cancelAtPeriodEnd: integer('cancel_at_period_end', { mode: 'boolean' }).default(
    false,
  ),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
});
