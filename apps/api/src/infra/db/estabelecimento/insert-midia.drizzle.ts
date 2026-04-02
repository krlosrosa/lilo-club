import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import type { MidiaTipo } from '../../../domain/model/guia.enums.js';
import type { EstabelecimentoMidiaRecord } from '../../../domain/model/estabelecimento.model.js';
import { estabelecimentosMidias } from '../providers/drizzle/config/migrations/index.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';
import { mapMidiaRow } from './map-estabelecimento-rows.js';

export async function insertMidiaDb(
  db: DrizzleClient,
  params: {
    estabelecimentoId: string;
    tipo: MidiaTipo;
    storageKey: string;
    urlPublica: string | null;
    ordem: number;
  },
): Promise<EstabelecimentoMidiaRecord> {
  const now = Date.now();
  const id = randomUUID();
  await db.insert(estabelecimentosMidias).values({
    id,
    estabelecimentoId: params.estabelecimentoId,
    tipo: params.tipo,
    storageKey: params.storageKey,
    urlPublica: params.urlPublica,
    ordem: params.ordem,
    createdAt: now,
  });
  const row = (await db.select().from(estabelecimentosMidias).where(eq(estabelecimentosMidias.id, id)).limit(1))[0];
  if (!row) throw new Error('insert midia failed');
  return mapMidiaRow(row);
}
