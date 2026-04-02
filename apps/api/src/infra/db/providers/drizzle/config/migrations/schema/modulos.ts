import { pgTable, text, integer, primaryKey } from 'drizzle-orm/pg-core';
import { plans } from './saas';

export const modulos = pgTable('modulos', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  nome: text('nome').notNull(),
  descricao: text('descricao'),
  ordem: integer('ordem').notNull().default(0),
});

export const planModulos = pgTable(
  'plan_modulos',
  {
    planId: text('plan_id')
      .notNull()
      .references(() => plans.id, { onDelete: 'cascade' }),
    moduloId: text('modulo_id')
      .notNull()
      .references(() => modulos.id, { onDelete: 'cascade' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.planId, t.moduloId] }),
  }),
);
