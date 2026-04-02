import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

/** Placeholder table so the schema is non-empty until domain tables exist. */
export const meta = sqliteTable('meta', {
  key: text('key').primaryKey(),
  value: text('value'),
});

export * from './schema/users.js';
export * from './schema/oauth-identities.js';
export * from './schema/saas.js';
export * from './schema/cidades.js';
export * from './schema/modulos.js';
export * from './schema/estabelecimento.js';
