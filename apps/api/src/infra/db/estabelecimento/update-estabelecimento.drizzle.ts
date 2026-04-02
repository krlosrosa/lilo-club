import { eq } from 'drizzle-orm';
import type { EstabelecimentoStatus } from '../../../domain/model/guia.enums.js';
import type { EstabelecimentoRecord } from '../../../domain/model/estabelecimento.model.js';
import { estabelecimentos } from '../providers/drizzle/config/migrations/index.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';
import { mapEstabelecimentoRow } from './map-estabelecimento-rows.js';

export type UpdateEstabelecimentoDbPatch = {
  nome?: string;
  descricao?: string | null;
  conteudoSemantico?: string | null;
  pesoDestaque?: number;
  categoriaId?: string;
  publicado?: boolean;
  destaque?: boolean;
  status?: EstabelecimentoStatus;
};

export async function updateEstabelecimentoDb(
  db: DrizzleClient,
  id: string,
  accountId: string,
  patch: UpdateEstabelecimentoDbPatch,
): Promise<EstabelecimentoRecord | null> {
  const current = (
    await db
      .select()
      .from(estabelecimentos)
      .where(eq(estabelecimentos.id, id))
      .limit(1)
  )[0];
  if (!current || current.accountId !== accountId) return null;

  const now = Date.now();
  await db
    .update(estabelecimentos)
    .set({ ...patch, updatedAt: now })
    .where(eq(estabelecimentos.id, id));

  const row = (await db.select().from(estabelecimentos).where(eq(estabelecimentos.id, id)).limit(1))[0];
  if (!row) return null;
  return mapEstabelecimentoRow(row);
}
