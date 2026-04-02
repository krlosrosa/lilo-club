import { and, eq } from 'drizzle-orm';
import type { EstabelecimentoAvaliacaoRecord } from '../../../domain/model/estabelecimento.model.js';
import { estabelecimentos, estabelecimentosAvaliacoes } from '../providers/drizzle/config/migrations/index.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';
import { mapAvaliacaoRow } from './map-estabelecimento-rows.js';

export async function updateAvaliacaoRespostaDb(
  db: DrizzleClient,
  avaliacaoId: string,
  estabelecimentoId: string,
  accountId: string,
  resposta: string,
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
        eq(estabelecimentosAvaliacoes.id, avaliacaoId),
        eq(estabelecimentosAvaliacoes.estabelecimentoId, estabelecimentoId),
        eq(estabelecimentos.accountId, accountId),
      ),
    )
    .limit(1);

  const hit = rows[0]?.a;
  if (!hit) return null;

  const now = Date.now();
  await db
    .update(estabelecimentosAvaliacoes)
    .set({ resposta, respondidoEm: now })
    .where(eq(estabelecimentosAvaliacoes.id, avaliacaoId));

  const next = (
    await db.select().from(estabelecimentosAvaliacoes).where(eq(estabelecimentosAvaliacoes.id, avaliacaoId)).limit(1)
  )[0];
  if (!next) return null;
  return mapAvaliacaoRow(next);
}
