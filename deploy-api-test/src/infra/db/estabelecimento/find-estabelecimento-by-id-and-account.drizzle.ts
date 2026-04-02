import { and, eq } from 'drizzle-orm';
import type { EstabelecimentoRecord } from '../../../domain/model/estabelecimento.model.js';
import { estabelecimentos } from '../providers/drizzle/config/migrations/index.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';
import { mapEstabelecimentoRow } from './map-estabelecimento-rows.js';

export async function findEstabelecimentoByIdAndAccountDb(
  db: DrizzleClient,
  id: string,
  accountId: string,
): Promise<EstabelecimentoRecord | null> {
  const rows = await db
    .select()
    .from(estabelecimentos)
    .where(and(eq(estabelecimentos.id, id), eq(estabelecimentos.accountId, accountId)))
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  return mapEstabelecimentoRow(row);
}
