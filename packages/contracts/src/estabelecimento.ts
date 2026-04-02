import { z } from 'zod';

export const estabelecimentoStatusSchema = z.enum(['rascunho', 'publicado']);

export const estabelecimentoListItemSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
  categoriaId: z.string().uuid(),
  categoriaNome: z.string(),
  status: estabelecimentoStatusSchema,
  publicado: z.boolean(),
  destaque: z.boolean(),
  scoreMedio: z.number().nullable(),
  totalAvaliacoes: z.number().int().nonnegative(),
});

export const listEstabelecimentosResponseSchema = z.object({
  items: z.array(estabelecimentoListItemSchema),
});

export type ListEstabelecimentosResponse = z.infer<typeof listEstabelecimentosResponseSchema>;

export const createEstabelecimentoBodySchema = z.object({
  nome: z.string().min(1).max(200),
  cidadeId: z.string().uuid(),
  categoriaId: z.string().uuid(),
});

export type CreateEstabelecimentoBody = z.infer<typeof createEstabelecimentoBodySchema>;

export const estabelecimentoDetailSchema = z.object({
  id: z.string().uuid(),
  accountId: z.string().uuid(),
  cidadeId: z.string().uuid(),
  categoriaId: z.string().uuid(),
  categoriaNome: z.string(),
  nome: z.string(),
  slug: z.string().nullable(),
  descricao: z.string().nullable(),
  conteudoSemantico: z.string().nullable(),
  pesoDestaque: z.number().int(),
  status: estabelecimentoStatusSchema,
  publicado: z.boolean(),
  destaque: z.boolean(),
  scoreMedio: z.number().nullable(),
  totalAvaliacoes: z.number().int().nonnegative(),
  createdAt: z.number().int(),
  updatedAt: z.number().int(),
});

export type EstabelecimentoDetail = z.infer<typeof estabelecimentoDetailSchema>;

export const patchEstabelecimentoBodySchema = z.object({
  nome: z.string().min(1).max(200).optional(),
  descricao: z.string().max(8000).nullable().optional(),
  conteudoSemantico: z.string().max(20000).nullable().optional(),
  pesoDestaque: z.number().int().min(0).max(1_000_000).optional(),
  categoriaId: z.string().uuid().optional(),
  publicado: z.boolean().optional(),
  destaque: z.boolean().optional(),
  status: estabelecimentoStatusSchema.optional(),
});

export type PatchEstabelecimentoBody = z.infer<typeof patchEstabelecimentoBodySchema>;

export const postSuggestEstabelecimentoDescricaoBodySchema = z.object({
  rascunho: z.string().min(1).max(8000),
});

export type PostSuggestEstabelecimentoDescricaoBody = z.infer<
  typeof postSuggestEstabelecimentoDescricaoBodySchema
>;

export const suggestEstabelecimentoDescricaoResponseSchema = z.object({
  descricaoSugerida: z.string().min(1).max(8000),
});

export type SuggestEstabelecimentoDescricaoResponse = z.infer<
  typeof suggestEstabelecimentoDescricaoResponseSchema
>;

export const estabelecimentoEnderecoSchema = z.object({
  estabelecimentoId: z.string().uuid(),
  cep: z.string().nullable(),
  logradouro: z.string().nullable(),
  bairro: z.string().nullable(),
  cidade: z.string().nullable(),
  uf: z.string().max(2).nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  localVerificado: z.boolean(),
  atualizadoEm: z.number().int().nullable(),
});

export type EstabelecimentoEndereco = z.infer<typeof estabelecimentoEnderecoSchema>;

export const patchEstabelecimentoEnderecoBodySchema = z.object({
  cep: z.string().max(20).nullable().optional(),
  logradouro: z.string().max(500).nullable().optional(),
  bairro: z.string().max(200).nullable().optional(),
  cidade: z.string().max(200).nullable().optional(),
  uf: z.string().max(2).nullable().optional(),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  localVerificado: z.boolean().optional(),
});

export type PatchEstabelecimentoEnderecoBody = z.infer<
  typeof patchEstabelecimentoEnderecoBodySchema
>;

export const horarioIntervaloInputSchema = z.object({
  diaSemana: z.number().int().min(0).max(6),
  ordem: z.number().int().nonnegative(),
  abre: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  fecha: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
});

export const putEstabelecimentoHorariosBodySchema = z.object({
  intervalos: z.array(horarioIntervaloInputSchema),
});

export type PutEstabelecimentoHorariosBody = z.infer<typeof putEstabelecimentoHorariosBodySchema>;

export const postSuggestEstabelecimentoHorarioBodySchema = z.object({
  texto: z.string().min(1).max(2000),
});

export type PostSuggestEstabelecimentoHorarioBody = z.infer<
  typeof postSuggestEstabelecimentoHorarioBodySchema
>;

export const suggestEstabelecimentoHorarioResponseSchema = z.object({
  intervalos: z.array(horarioIntervaloInputSchema),
});

export type SuggestEstabelecimentoHorarioResponse = z.infer<
  typeof suggestEstabelecimentoHorarioResponseSchema
>;

export const estabelecimentoHorarioIntervaloSchema = z.object({
  id: z.string().uuid(),
  estabelecimentoId: z.string().uuid(),
  diaSemana: z.number().int().min(0).max(6),
  ordem: z.number().int().nonnegative(),
  abre: z.string(),
  fecha: z.string(),
});

export const listEstabelecimentoHorariosResponseSchema = z.object({
  intervalos: z.array(estabelecimentoHorarioIntervaloSchema),
});

export type ListEstabelecimentoHorariosResponse = z.infer<
  typeof listEstabelecimentoHorariosResponseSchema
>;

export const midiaTipoSchema = z.enum(['logo', 'capa', 'galeria']);

export const estabelecimentoMidiaSchema = z.object({
  id: z.string().uuid(),
  estabelecimentoId: z.string().uuid(),
  tipo: midiaTipoSchema,
  urlPublica: z.string().nullable(),
  ordem: z.number().int().nonnegative(),
  createdAt: z.number().int(),
});

export const listEstabelecimentoMidiasResponseSchema = z.object({
  items: z.array(estabelecimentoMidiaSchema),
});

export type ListEstabelecimentoMidiasResponse = z.infer<
  typeof listEstabelecimentoMidiasResponseSchema
>;

export const midiaUploadResponseSchema = estabelecimentoMidiaSchema;

export type MidiaUploadResponse = z.infer<typeof midiaUploadResponseSchema>;

export const patchMidiasOrdemBodySchema = z.object({
  idsOrdenados: z.array(z.string().uuid()),
});

export type PatchMidiasOrdemBody = z.infer<typeof patchMidiasOrdemBodySchema>;

export const estabelecimentoAvaliacaoItemSchema = z.object({
  id: z.string().uuid(),
  estabelecimentoId: z.string().uuid(),
  nota: z.number().int().min(1).max(5),
  comentario: z.string().nullable(),
  resposta: z.string().nullable(),
  respondidoEm: z.number().int().nullable(),
  destaquePositivo: z.boolean().nullable(),
  utilCount: z.number().int().nonnegative(),
  createdAt: z.number().int(),
});

export const listEstabelecimentoAvaliacoesResponseSchema = z.object({
  items: z.array(estabelecimentoAvaliacaoItemSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().nonnegative(),
  pageSize: z.number().int().positive(),
});

export type ListEstabelecimentoAvaliacoesResponse = z.infer<
  typeof listEstabelecimentoAvaliacoesResponseSchema
>;

export const patchEstabelecimentoAvaliacaoBodySchema = z.object({
  resposta: z.string().min(1).max(4000),
});

export type PatchEstabelecimentoAvaliacaoBody = z.infer<
  typeof patchEstabelecimentoAvaliacaoBodySchema
>;

export const listAvaliacoesQuerySchema = z.object({
  page: z.coerce.number().int().min(0).default(0),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type ListAvaliacoesQuery = z.infer<typeof listAvaliacoesQuerySchema>;
