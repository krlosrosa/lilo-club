import { z } from 'zod';

export const authMeResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  nome: z.string().nullable(),
  telefone: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  tipoUsuario: z.enum(['cliente', 'dono', 'parceiro']).nullable(),
  platformRole: z.enum(['super_admin', 'none']),
  createdAt: z.number().int(),
});

export type AuthMeResponse = z.infer<typeof authMeResponseSchema>;

export const patchAuthMeBodySchema = z.object({
  nome: z.string().min(1).max(200).optional(),
  tipoUsuario: z.enum(['cliente', 'dono', 'parceiro']).nullable().optional(),
});

export type PatchAuthMeBody = z.infer<typeof patchAuthMeBodySchema>;
