import { z } from 'zod';

export const cidadeItemSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
  uf: z.string(),
  slug: z.string(),
});

export const listCidadesResponseSchema = z.object({
  items: z.array(cidadeItemSchema),
});

export type ListCidadesResponse = z.infer<typeof listCidadesResponseSchema>;

export const categoriaItemSchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
  ordem: z.number().int(),
});

export const listCategoriasResponseSchema = z.object({
  items: z.array(categoriaItemSchema),
});

export type ListCategoriasResponse = z.infer<typeof listCategoriasResponseSchema>;
