import { and, eq } from 'drizzle-orm';
import { estabelecimentos, estabelecimentosMidias } from '../providers/drizzle/config/migrations/index.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';

export async function deleteMidiaForAccountDb(
  db: DrizzleClient,
  midiaId: string,
  accountId: string,
): Promise<{ storageKey: string } | null> {
  const rows = await db
    .select({ m: estabelecimentosMidias })
    .from(estabelecimentosMidias)
    .innerJoin(estabelecimentos, eq(estabelecimentos.id, estabelecimentosMidias.estabelecimentoId))
    .where(and(eq(estabelecimentosMidias.id, midiaId), eq(estabelecimentos.accountId, accountId)))
    .limit(1);
  const r = rows[0]?.m;
  if (!r) return null;

  await db.delete(estabelecimentosMidias).where(eq(estabelecimentosMidias.id, midiaId));
  return { storageKey: r.storageKey };
}
