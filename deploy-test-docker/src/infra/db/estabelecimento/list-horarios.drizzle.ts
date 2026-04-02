import { and, asc, eq } from 'drizzle-orm';
import type { EstabelecimentoHorarioIntervaloRecord } from '../../../domain/model/estabelecimento.model.js';
import { estabelecimentos, estabelecimentosHorarioIntervalos } from '../providers/drizzle/config/migrations/index.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';
import { mapHorarioRow } from './map-estabelecimento-rows.js';

export async function listHorariosForAccountDb(
  db: DrizzleClient,
  estabelecimentoId: string,
  accountId: string,
): Promise<EstabelecimentoHorarioIntervaloRecord[]> {
  const rows = await db
    .select({ h: estabelecimentosHorarioIntervalos })
    .from(estabelecimentosHorarioIntervalos)
    .innerJoin(
      estabelecimentos,
      eq(estabelecimentos.id, estabelecimentosHorarioIntervalos.estabelecimentoId),
    )
    .where(
      and(
        eq(estabelecimentosHorarioIntervalos.estabelecimentoId, estabelecimentoId),
        eq(estabelecimentos.accountId, accountId),
      ),
    )
    .orderBy(asc(estabelecimentosHorarioIntervalos.diaSemana), asc(estabelecimentosHorarioIntervalos.ordem));

  return rows.map((r) => mapHorarioRow(r.h));
}
