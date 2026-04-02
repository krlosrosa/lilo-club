import type { InferSelectModel } from 'drizzle-orm';
import { userRecordSchema, type UserRecord } from '../../../domain/model/user.model.js';
import { users } from '../providers/drizzle/config/migrations/schema/users.js';

export function mapUserRow(row: InferSelectModel<typeof users>): UserRecord {
  return userRecordSchema.parse({
    id: row.id,
    email: row.email,
    nome: row.nome,
    telefone: row.telefone,
    avatarUrl: row.avatarUrl,
    tipoUsuario: row.tipoUsuario,
    platformRole: row.platformRole,
    createdAt: row.createdAt,
  });
}
