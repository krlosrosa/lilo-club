import { eq } from 'drizzle-orm';
import { categorias } from '../providers/drizzle/config/migrations/index.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';

export async function findCategoriaNomeDb(
  db: DrizzleClient,
  categoriaId: string,
): Promise<string | null> {
  const rows = await db.select({ nome: categorias.nome }).from(categorias).where(eq(categorias.id, categoriaId)).limit(1);
  return rows[0]?.nome ?? null;
}
