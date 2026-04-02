import { and, asc, eq } from 'drizzle-orm';
import type { EstabelecimentoMidiaRecord } from '../../../domain/model/estabelecimento.model.js';
import { estabelecimentos, estabelecimentosMidias } from '../providers/drizzle/config/migrations/index.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';
import { mapMidiaRow } from './map-estabelecimento-rows.js';

export async function listMidiasForAccountDb(
  db: DrizzleClient,
  estabelecimentoId: string,
  accountId: string,
): Promise<EstabelecimentoMidiaRecord[]> {
  const rows = await db
    .select({ m: estabelecimentosMidias })
    .from(estabelecimentosMidias)
    .innerJoin(estabelecimentos, eq(estabelecimentos.id, estabelecimentosMidias.estabelecimentoId))
    .where(
      and(
        eq(estabelecimentosMidias.estabelecimentoId, estabelecimentoId),
        eq(estabelecimentos.accountId, accountId),
      ),
    )
    .orderBy(asc(estabelecimentosMidias.ordem), asc(estabelecimentosMidias.createdAt));

  return rows.map((r) => mapMidiaRow(r.m));
}
