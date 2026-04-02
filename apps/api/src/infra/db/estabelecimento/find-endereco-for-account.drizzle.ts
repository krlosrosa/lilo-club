import { and, eq } from 'drizzle-orm';
import type { EstabelecimentoEnderecoRecord } from '../../../domain/model/estabelecimento.model.js';
import { estabelecimentos, estabelecimentosEnderecos } from '../providers/drizzle/config/migrations/index.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';
import { mapEnderecoRow } from './map-estabelecimento-rows.js';

export async function findEnderecoForAccountDb(
  db: DrizzleClient,
  estabelecimentoId: string,
  accountId: string,
): Promise<EstabelecimentoEnderecoRecord | null> {
  const rows = await db
    .select({ endereco: estabelecimentosEnderecos })
    .from(estabelecimentosEnderecos)
    .innerJoin(
      estabelecimentos,
      eq(estabelecimentos.id, estabelecimentosEnderecos.estabelecimentoId),
    )
    .where(
      and(
        eq(estabelecimentosEnderecos.estabelecimentoId, estabelecimentoId),
        eq(estabelecimentos.accountId, accountId),
      ),
    )
    .limit(1);
  const r = rows[0]?.endereco;
  if (!r) return null;
  return mapEnderecoRow(r);
}
