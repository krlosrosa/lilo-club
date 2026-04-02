import { z } from 'zod';

export const cidadeRecordSchema = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1),
  uf: z.string().length(2),
  slug: z.string().min(1),
  createdAt: z.number().int(),
});

export type CidadeRecord = z.infer<typeof cidadeRecordSchema>;

export const cidadeAfiliadoRecordSchema = z.object({
  id: z.string().uuid(),
  cidadeId: z.string().uuid(),
  userId: z.string().uuid(),
  ativo: z.boolean(),
  createdAt: z.number().int(),
});

export type CidadeAfiliadoRecord = z.infer<typeof cidadeAfiliadoRecordSchema>;
