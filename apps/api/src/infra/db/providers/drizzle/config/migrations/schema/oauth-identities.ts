import { pgTable, text, bigint, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from './users';

export const oauthIdentities = pgTable(
  'oauth_identities',
  {
    id: text('id').primaryKey(),
    provider: text('provider').notNull(),
    providerUserId: text('provider_user_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: bigint('created_at', { mode: 'number' }).notNull(),
  },
  (t) => ({
    uqProviderSub: uniqueIndex('uq_oauth_identities_provider_sub').on(
      t.provider,
      t.providerUserId,
    ),
  }),
);
