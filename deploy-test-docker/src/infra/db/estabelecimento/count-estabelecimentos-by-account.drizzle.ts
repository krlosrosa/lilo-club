import { eq, sql } from 'drizzle-orm';
import { estabelecimentos } from '../providers/drizzle/config/migrations/index.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';

export async function countEstabelecimentosByAccountDb(
  db: DrizzleClient,
  accountId: string,
): Promise<number> {
  const rows = await db
    .select({ n: sql<number>`count(*)`.mapWith(Number) })
    .from(estabelecimentos)
    .where(eq(estabelecimentos.accountId, accountId));
  return rows[0]?.n ?? 0;
}
