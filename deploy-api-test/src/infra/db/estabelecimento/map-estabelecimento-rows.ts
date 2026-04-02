import type { InferSelectModel } from 'drizzle-orm';
import {
  estabelecimentoAvaliacaoRecordSchema,
  estabelecimentoEnderecoRecordSchema,
  estabelecimentoHorarioIntervaloRecordSchema,
  estabelecimentoMidiaRecordSchema,
  estabelecimentoRecordSchema,
  type EstabelecimentoAvaliacaoRecord,
  type EstabelecimentoEnderecoRecord,
  type EstabelecimentoHorarioIntervaloRecord,
  type EstabelecimentoMidiaRecord,
  type EstabelecimentoRecord,
} from '../../../domain/model/estabelecimento.model.js';
import {
  estabelecimentos,
  estabelecimentosAvaliacoes,
  estabelecimentosEnderecos,
  estabelecimentosHorarioIntervalos,
  estabelecimentosMidias,
} from '../providers/drizzle/config/migrations/index.js';

export function mapEstabelecimentoRow(
  row: InferSelectModel<typeof estabelecimentos>,
): EstabelecimentoRecord {
  return estabelecimentoRecordSchema.parse({
    id: row.id,
    accountId: row.accountId,
    cidadeId: row.cidadeId,
    categoriaId: row.categoriaId,
    nome: row.nome,
    slug: row.slug ?? null,
    descricao: row.descricao ?? null,
    conteudoSemantico: row.conteudoSemantico ?? null,
    pesoDestaque: row.pesoDestaque,
    status: row.status,
    publicado: row.publicado,
    destaque: row.destaque,
    scoreMedio: row.scoreMedio ?? null,
    totalAvaliacoes: row.totalAvaliacoes,
    codigoPublico: row.codigoPublico ?? null,
    createdByUserId: row.createdByUserId ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

export function mapEnderecoRow(
  row: InferSelectModel<typeof estabelecimentosEnderecos>,
): EstabelecimentoEnderecoRecord {
  return estabelecimentoEnderecoRecordSchema.parse({
    estabelecimentoId: row.estabelecimentoId,
    cep: row.cep ?? null,
    logradouro: row.logradouro ?? null,
    bairro: row.bairro ?? null,
    cidade: row.cidade ?? null,
    uf: row.uf ?? null,
    latitude: row.latitude ?? null,
    longitude: row.longitude ?? null,
    localVerificado: row.localVerificado,
    atualizadoEm: row.atualizadoEm ?? null,
  });
}

export function mapHorarioRow(
  row: InferSelectModel<typeof estabelecimentosHorarioIntervalos>,
): EstabelecimentoHorarioIntervaloRecord {
  return estabelecimentoHorarioIntervaloRecordSchema.parse({
    id: row.id,
    estabelecimentoId: row.estabelecimentoId,
    diaSemana: row.diaSemana,
    ordem: row.ordem,
    abre: row.abre,
    fecha: row.fecha,
  });
}

export function mapMidiaRow(
  row: InferSelectModel<typeof estabelecimentosMidias>,
): EstabelecimentoMidiaRecord {
  return estabelecimentoMidiaRecordSchema.parse({
    id: row.id,
    estabelecimentoId: row.estabelecimentoId,
    tipo: row.tipo,
    storageKey: row.storageKey,
    urlPublica: row.urlPublica ?? null,
    ordem: row.ordem,
    createdAt: row.createdAt,
  });
}

export function mapAvaliacaoRow(
  row: InferSelectModel<typeof estabelecimentosAvaliacoes>,
): EstabelecimentoAvaliacaoRecord {
  return estabelecimentoAvaliacaoRecordSchema.parse({
    id: row.id,
    estabelecimentoId: row.estabelecimentoId,
    autorId: row.autorId ?? null,
    nota: row.nota,
    comentario: row.comentario ?? null,
    resposta: row.resposta ?? null,
    respondidoEm: row.respondidoEm ?? null,
    destaquePositivo: row.destaquePositivo ?? null,
    temMidia: row.temMidia,
    utilCount: row.utilCount,
    createdAt: row.createdAt,
  });
}
