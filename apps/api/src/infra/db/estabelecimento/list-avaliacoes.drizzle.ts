import { and, desc, eq, sql } from 'drizzle-orm';
import type { EstabelecimentoAvaliacaoRecord } from '../../../domain/model/estabelecimento.model.js';
import { estabelecimentos, estabelecimentosAvaliacoes } from '../providers/drizzle/config/migrations/index.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';
import { mapAvaliacaoRow } from './map-estabelecimento-rows.js';

export async function listAvaliacoesForAccountDb(
  db: DrizzleClient,
  estabelecimentoId: string,
  accountId: string,
  page: number,
  pageSize: number,
): Promise<{ items: EstabelecimentoAvaliacaoRecord[]; total: number }> {
  const where = and(
    eq(estabelecimentosAvaliacoes.estabelecimentoId, estabelecimentoId),
    eq(estabelecimentos.accountId, accountId),
  );

  const totalRows = await db
    .select({ n: sql<number>`count(*)`.mapWith(Number) })
    .from(estabelecimentosAvaliacoes)
    .innerJoin(
      estabelecimentos,
      eq(estabelecimentos.id, estabelecimentosAvaliacoes.estabelecimentoId),
    )
    .where(where);

  const total = totalRows[0]?.n ?? 0;
  const offset = page * pageSize;

  const rows = await db
    .select({ a: estabelecimentosAvaliacoes })
    .from(estabelecimentosAvaliacoes)
    .innerJoin(
      estabelecimentos,
      eq(estabelecimentos.id, estabelecimentosAvaliacoes.estabelecimentoId),
    )
    .where(where)
    .orderBy(desc(estabelecimentosAvaliacoes.createdAt))
    .limit(pageSize)
    .offset(offset);

  return {
    items: rows.map((r) => mapAvaliacaoRow(r.a)),
    total,
  };
}
