import { and, eq } from 'drizzle-orm';
import type { EstabelecimentoMidiaRecord } from '../../../domain/model/estabelecimento.model.js';
import { estabelecimentos, estabelecimentosMidias } from '../providers/drizzle/config/migrations/index.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';
import { mapMidiaRow } from './map-estabelecimento-rows.js';

export async function findMidiaByIdAndAccountDb(
  db: DrizzleClient,
  midiaId: string,
  accountId: string,
): Promise<EstabelecimentoMidiaRecord | null> {
  const rows = await db
    .select({ m: estabelecimentosMidias })
    .from(estabelecimentosMidias)
    .innerJoin(estabelecimentos, eq(estabelecimentos.id, estabelecimentosMidias.estabelecimentoId))
    .where(and(eq(estabelecimentosMidias.id, midiaId), eq(estabelecimentos.accountId, accountId)))
    .limit(1);
  const r = rows[0]?.m;
  if (!r) return null;
  return mapMidiaRow(r);
}
