import { eq } from 'drizzle-orm';
import type { TipoUsuarioPerfil } from '../../../domain/model/guia.enums.js';
import type { UserRecord } from '../../../domain/model/user.model.js';
import { users } from '../providers/drizzle/config/migrations/index.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';
import { mapUserRow } from './map-user-row.js';

export type UpdateUserProfileInput = {
  nome?: string | null;
  tipoUsuario?: TipoUsuarioPerfil | null;
};

export async function updateUserProfileDb(
  db: DrizzleClient,
  userId: string,
  input: UpdateUserProfileInput,
): Promise<UserRecord | null> {
  const row = (await db.select().from(users).where(eq(users.id, userId)).limit(1))[0];
  if (!row) return null;

  const updates: Partial<typeof users.$inferInsert> = {};
  if (input.nome !== undefined) updates.nome = input.nome;
  if (input.tipoUsuario !== undefined) updates.tipoUsuario = input.tipoUsuario;

  if (Object.keys(updates).length === 0) {
    return mapUserRow(row);
  }

  await db.update(users).set(updates).where(eq(users.id, userId));
  const next = (await db.select().from(users).where(eq(users.id, userId)).limit(1))[0];
  if (!next) return null;
  return mapUserRow(next);
}
