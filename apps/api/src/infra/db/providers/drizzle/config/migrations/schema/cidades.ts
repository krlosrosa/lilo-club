import { pgTable, text, integer, boolean } from 'drizzle-orm/pg-core';
import { users } from './users';

export const cidades = pgTable('cidades', {
  id: text('id').primaryKey(),
  nome: text('nome').notNull(),
  uf: text('uf').notNull(),
  slug: text('slug').notNull().unique(),
  dominio: text('dominio').unique(),
  createdAt: integer('created_at').notNull(),
});

export const cidadesAfiliados = pgTable('cidades_afiliados', {
  id: text('id').primaryKey(),
  cidadeId: text('cidade_id')
    .notNull()
    .references(() => cidades.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  ativo: boolean('ativo').notNull().default(true),
  createdAt: integer('created_at').notNull(),
});
