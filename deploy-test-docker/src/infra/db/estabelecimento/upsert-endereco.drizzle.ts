import { eq } from 'drizzle-orm';
import type { EstabelecimentoEnderecoRecord } from '../../../domain/model/estabelecimento.model.js';
import { estabelecimentosEnderecos } from '../providers/drizzle/config/migrations/index.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';
import { findEstabelecimentoByIdAndAccountDb } from './find-estabelecimento-by-id-and-account.drizzle.js';
import { mapEnderecoRow } from './map-estabelecimento-rows.js';

export type UpsertEnderecoDbInput = {
  cep?: string | null;
  logradouro?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  uf?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  localVerificado?: boolean;
};

export async function upsertEnderecoForAccountDb(
  db: DrizzleClient,
  estabelecimentoId: string,
  accountId: string,
  input: UpsertEnderecoDbInput,
): Promise<EstabelecimentoEnderecoRecord | null> {
  const est = await findEstabelecimentoByIdAndAccountDb(db, estabelecimentoId, accountId);
  if (!est) return null;

  const now = Date.now();
  const existing = (
    await db
      .select()
      .from(estabelecimentosEnderecos)
      .where(eq(estabelecimentosEnderecos.estabelecimentoId, estabelecimentoId))
      .limit(1)
  )[0];

  if (!existing) {
    await db.insert(estabelecimentosEnderecos).values({
      estabelecimentoId,
      cep: input.cep ?? null,
      logradouro: input.logradouro ?? null,
      bairro: input.bairro ?? null,
      cidade: input.cidade ?? null,
      uf: input.uf ?? null,
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      localVerificado: input.localVerificado ?? false,
      atualizadoEm: now,
    });
  } else {
    await db
      .update(estabelecimentosEnderecos)
      .set({
        ...(input.cep !== undefined ? { cep: input.cep } : {}),
        ...(input.logradouro !== undefined ? { logradouro: input.logradouro } : {}),
        ...(input.bairro !== undefined ? { bairro: input.bairro } : {}),
        ...(input.cidade !== undefined ? { cidade: input.cidade } : {}),
        ...(input.uf !== undefined ? { uf: input.uf } : {}),
        ...(input.latitude !== undefined ? { latitude: input.latitude } : {}),
        ...(input.longitude !== undefined ? { longitude: input.longitude } : {}),
        ...(input.localVerificado !== undefined
          ? { localVerificado: input.localVerificado }
          : {}),
        atualizadoEm: now,
      })
      .where(eq(estabelecimentosEnderecos.estabelecimentoId, estabelecimentoId));
  }

  const row = (
    await db
      .select()
      .from(estabelecimentosEnderecos)
      .where(eq(estabelecimentosEnderecos.estabelecimentoId, estabelecimentoId))
      .limit(1)
  )[0];
  if (!row) return null;
  return mapEnderecoRow(row);
}
