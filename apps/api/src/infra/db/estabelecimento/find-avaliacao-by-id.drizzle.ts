import { and, eq } from 'drizzle-orm';
import type { EstabelecimentoAvaliacaoRecord } from '../../../domain/model/estabelecimento.model.js';
import { estabelecimentos, estabelecimentosAvaliacoes } from '../providers/drizzle/config/migrations/index.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';
import { mapAvaliacaoRow } from './map-estabelecimento-rows.js';

export async function findAvaliacaoByIdForAccountDb(
  db: DrizzleClient,
  estabelecimentoId: string,
  accountId: string,
  avaliacaoId: string,
): Promise<EstabelecimentoAvaliacaoRecord | null> {
  const rows = await db
    .select({ a: estabelecimentosAvaliacoes })
    .from(estabelecimentosAvaliacoes)
    .innerJoin(
      estabelecimentos,
      eq(estabelecimentos.id, estabelecimentosAvaliacoes.estabelecimentoId),
    )
    .where(
      and(
        eq(estabelecimentosAvaliacoes.estabelecimentoId, estabelecimentoId),
        eq(estabelecimentos.accountId, accountId),
        eq(estabelecimentosAvaliacoes.id, avaliacaoId),
      ),
    )
    .limit(1);

  const row = rows[0];
  return row ? mapAvaliacaoRow(row.a) : null;
}
