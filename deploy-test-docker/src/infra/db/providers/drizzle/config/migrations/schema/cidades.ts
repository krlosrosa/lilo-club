import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { users } from './users';

export const cidades = sqliteTable('cidades', {
  id: text('id').primaryKey(),
  nome: text('nome').notNull(),
  uf: text('uf').notNull(),
  slug: text('slug').notNull().unique(),
  dominio: text('dominio').unique(),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
});

/** Nome da tabela com prefixo `cidades_` para ordem de FK no SQLite (após `cidades`). */
export const cidadesAfiliados = sqliteTable('cidades_afiliados', {
  id: text('id').primaryKey(),
  cidadeId: text('cidade_id')
    .notNull()
    .references(() => cidades.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  ativo: integer('ativo', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
});
