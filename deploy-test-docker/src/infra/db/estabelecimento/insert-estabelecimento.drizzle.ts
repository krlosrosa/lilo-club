import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import type { EstabelecimentoRecord } from '../../../domain/model/estabelecimento.model.js';
import { estabelecimentos } from '../providers/drizzle/config/migrations/index.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';
import { mapEstabelecimentoRow } from './map-estabelecimento-rows.js';

export type InsertEstabelecimentoDbInput = {
  accountId: string;
  cidadeId: string;
  categoriaId: string;
  nome: string;
  createdByUserId: string | null;
};

export async function insertEstabelecimentoDb(
  db: DrizzleClient,
  input: InsertEstabelecimentoDbInput,
): Promise<EstabelecimentoRecord> {
  const now = Date.now();
  const id = randomUUID();
  await db.insert(estabelecimentos).values({
    id,
    accountId: input.accountId,
    cidadeId: input.cidadeId,
    categoriaId: input.categoriaId,
    nome: input.nome,
    slug: null,
    descricao: null,
    conteudoSemantico: null,
    pesoDestaque: 0,
    status: 'rascunho',
    publicado: false,
    destaque: false,
    scoreMedio: null,
    totalAvaliacoes: 0,
    codigoPublico: null,
    createdByUserId: input.createdByUserId,
    createdAt: now,
    updatedAt: now,
  });
  const rows = await db.select().from(estabelecimentos).where(eq(estabelecimentos.id, id)).limit(1);
  const row = rows[0];
  if (!row) throw new Error('Insert estabelecimento failed');
  return mapEstabelecimentoRow(row);
}
