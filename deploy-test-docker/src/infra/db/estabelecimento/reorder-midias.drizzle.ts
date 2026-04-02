import { and, eq } from 'drizzle-orm';
import { estabelecimentos, estabelecimentosMidias } from '../providers/drizzle/config/migrations/index.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';
import { findEstabelecimentoByIdAndAccountDb } from './find-estabelecimento-by-id-and-account.drizzle.js';

export async function reorderMidiasForAccountDb(
  db: DrizzleClient,
  estabelecimentoId: string,
  accountId: string,
  idsOrdenados: string[],
): Promise<boolean> {
  const est = await findEstabelecimentoByIdAndAccountDb(db, estabelecimentoId, accountId);
  if (!est) return false;

  const existing = await db
    .select({ id: estabelecimentosMidias.id })
    .from(estabelecimentosMidias)
    .innerJoin(estabelecimentos, eq(estabelecimentos.id, estabelecimentosMidias.estabelecimentoId))
    .where(
      and(
        eq(estabelecimentosMidias.estabelecimentoId, estabelecimentoId),
        eq(estabelecimentos.accountId, accountId),
      ),
    );

  const idSet = new Set(existing.map((e) => e.id));
  if (idsOrdenados.length !== idSet.size) return false;
  for (const id of idsOrdenados) {
    if (!idSet.has(id)) return false;
  }

  let ordem = 0;
  for (const id of idsOrdenados) {
    await db
      .update(estabelecimentosMidias)
      .set({ ordem })
      .where(eq(estabelecimentosMidias.id, id));
    ordem += 1;
  }

  return true;
}
