import { eq } from 'drizzle-orm';
import { cidades } from '../providers/drizzle/config/migrations/index.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';

export async function verifyCidadeExistsDb(db: DrizzleClient, id: string): Promise<boolean> {
  const rows = await db.select({ id: cidades.id }).from(cidades).where(eq(cidades.id, id)).limit(1);
  return rows.length > 0;
}
