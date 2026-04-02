import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { estabelecimentosHorarioIntervalos } from '../providers/drizzle/config/migrations/index.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';
import { findEstabelecimentoByIdAndAccountDb } from './find-estabelecimento-by-id-and-account.drizzle.js';

export type HorarioIntervaloReplaceInput = {
  diaSemana: number;
  ordem: number;
  abre: string;
  fecha: string;
};

export async function replaceHorariosForAccountDb(
  db: DrizzleClient,
  estabelecimentoId: string,
  accountId: string,
  intervalos: HorarioIntervaloReplaceInput[],
): Promise<boolean> {
  const est = await findEstabelecimentoByIdAndAccountDb(db, estabelecimentoId, accountId);
  if (!est) return false;

  db.transaction((tx) => {
    tx
      .delete(estabelecimentosHorarioIntervalos)
      .where(
        eq(estabelecimentosHorarioIntervalos.estabelecimentoId, estabelecimentoId),
      )
      .run();

    for (const it of intervalos) {
      tx
        .insert(estabelecimentosHorarioIntervalos)
        .values({
          id: randomUUID(),
          estabelecimentoId,
          diaSemana: it.diaSemana,
          ordem: it.ordem,
          abre: it.abre,
          fecha: it.fecha,
        })
        .run();
    }
  });

  return true;
}
