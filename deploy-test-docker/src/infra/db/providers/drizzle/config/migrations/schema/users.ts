import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  nome: text('nome'),
  telefone: text('telefone'),
  avatarUrl: text('avatar_url'),
  /** Perfil no guia público (Stitch): cliente | dono | parceiro */
  tipoUsuario: text('tipo_usuario'),
  /** Papel de plataforma: super_admin | none */
  platformRole: text('platform_role').notNull().default('none'),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
});
