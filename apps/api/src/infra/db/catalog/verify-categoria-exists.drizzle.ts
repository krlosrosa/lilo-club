import { eq } from 'drizzle-orm';
import { categorias } from '../providers/drizzle/config/migrations/index.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';

export async function verifyCategoriaExistsDb(db: DrizzleClient, id: string): Promise<boolean> {
  const rows = await db.select({ id: categorias.id }).from(categorias).where(eq(categorias.id, id)).limit(1);
  return rows.length > 0;
}
