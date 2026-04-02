import { z } from 'zod';
import { estabelecimentoStatusSchema, midiaTipoSchema } from './guia.enums.js';

export const categoriaRecordSchema = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1),
  ordem: z.number().int(),
});

export type CategoriaRecord = z.infer<typeof categoriaRecordSchema>;

export const estabelecimentoRecordSchema = z.object({
  id: z.string().uuid(),
  accountId: z.string().uuid(),
  cidadeId: z.string().uuid(),
  categoriaId: z.string().uuid(),
  nome: z.string().min(1),
  slug: z.string().nullable(),
  descricao: z.string().nullable(),
  conteudoSemantico: z.string().nullable(),
  pesoDestaque: z.number().int(),
  status: estabelecimentoStatusSchema,
  publicado: z.boolean(),
  destaque: z.boolean(),
  scoreMedio: z.number().nullable(),
  totalAvaliacoes: z.number().int().nonnegative(),
  codigoPublico: z.number().int().nullable(),
  createdByUserId: z.string().uuid().nullable(),
  createdAt: z.number().int(),
  updatedAt: z.number().int(),
});

export type EstabelecimentoRecord = z.infer<typeof estabelecimentoRecordSchema>;

export const estabelecimentoEnderecoRecordSchema = z.object({
  estabelecimentoId: z.string().uuid(),
  cep: z.string().nullable(),
  logradouro: z.string().nullable(),
  bairro: z.string().nullable(),
  cidade: z.string().nullable(),
  uf: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  localVerificado: z.boolean(),
  atualizadoEm: z.number().int().nullable(),
});

export type EstabelecimentoEnderecoRecord = z.infer<
  typeof estabelecimentoEnderecoRecordSchema
>;

export const estabelecimentoHorarioIntervaloRecordSchema = z.object({
  id: z.string().uuid(),
  estabelecimentoId: z.string().uuid(),
  diaSemana: z.number().int().min(0).max(6),
  ordem: z.number().int().nonnegative(),
  abre: z.string(),
  fecha: z.string(),
});

export type EstabelecimentoHorarioIntervaloRecord = z.infer<
  typeof estabelecimentoHorarioIntervaloRecordSchema
>;

export const estabelecimentoMidiaRecordSchema = z.object({
  id: z.string().uuid(),
  estabelecimentoId: z.string().uuid(),
  tipo: midiaTipoSchema,
  storageKey: z.string().min(1),
  urlPublica: z.string().nullable(),
  ordem: z.number().int().nonnegative(),
  createdAt: z.number().int(),
});

export type EstabelecimentoMidiaRecord = z.infer<typeof estabelecimentoMidiaRecordSchema>;

export const estabelecimentoAvaliacaoRecordSchema = z.object({
  id: z.string().uuid(),
  estabelecimentoId: z.string().uuid(),
  autorId: z.string().uuid().nullable(),
  nota: z.number().int().min(1).max(5),
  comentario: z.string().nullable(),
  resposta: z.string().nullable(),
  respondidoEm: z.number().int().nullable(),
  destaquePositivo: z.boolean().nullable(),
  temMidia: z.boolean(),
  utilCount: z.number().int().nonnegative(),
  createdAt: z.number().int(),
});

export type EstabelecimentoAvaliacaoRecord = z.infer<
  typeof estabelecimentoAvaliacaoRecordSchema
>;
