import { and, desc, eq, like } from 'drizzle-orm';
import type { EstabelecimentoRecord } from '../../../domain/model/estabelecimento.model.js';
import { categorias, estabelecimentos } from '../providers/drizzle/config/migrations/index.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';
import { mapEstabelecimentoRow } from './map-estabelecimento-rows.js';

export type EstabelecimentoListRow = {
  record: EstabelecimentoRecord;
  categoriaNome: string;
};

export async function listEstabelecimentosByAccountDb(
  db: DrizzleClient,
  accountId: string,
  search?: string,
): Promise<EstabelecimentoListRow[]> {
  const q = search?.trim();
  const rows = await db
    .select({
      row: estabelecimentos,
      categoriaNome: categorias.nome,
    })
    .from(estabelecimentos)
    .innerJoin(categorias, eq(categorias.id, estabelecimentos.categoriaId))
    .where(
      q
        ? and(eq(estabelecimentos.accountId, accountId), like(estabelecimentos.nome, `%${q}%`))
        : eq(estabelecimentos.accountId, accountId),
    )
    .orderBy(desc(estabelecimentos.updatedAt));

  return rows.map((r) => ({
    record: mapEstabelecimentoRow(r.row),
    categoriaNome: r.categoriaNome,
  }));
}
