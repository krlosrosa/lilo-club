import { pgTable, text } from 'drizzle-orm/pg-core';

/** Placeholder table so the schema is non-empty until domain tables exist. */
export const meta = pgTable('meta', {
  key: text('key').primaryKey(),
  value: text('value'),
});

export * from './schema/users';
export * from './schema/oauth-identities';
export * from './schema/saas';
export * from './schema/cidades';
export * from './schema/modulos';
export * from './schema/estabelecimento';
