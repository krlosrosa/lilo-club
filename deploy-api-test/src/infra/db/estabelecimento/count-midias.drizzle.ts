import { and, eq, sql } from 'drizzle-orm';
import { estabelecimentos, estabelecimentosMidias } from '../providers/drizzle/config/migrations/index.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';

export async function countMidiasForAccountDb(
  db: DrizzleClient,
  estabelecimentoId: string,
  accountId: string,
): Promise<number> {
  const rows = await db
    .select({ n: sql<number>`count(*)`.mapWith(Number) })
    .from(estabelecimentosMidias)
    .innerJoin(estabelecimentos, eq(estabelecimentos.id, estabelecimentosMidias.estabelecimentoId))
    .where(
      and(
        eq(estabelecimentosMidias.estabelecimentoId, estabelecimentoId),
        eq(estabelecimentos.accountId, accountId),
      ),
    );
  return rows[0]?.n ?? 0;
}
