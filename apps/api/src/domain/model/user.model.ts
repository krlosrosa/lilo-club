import { z } from 'zod';
import { platformRoleSchema, tipoUsuarioPerfilSchema } from './guia.enums.js';

export const userRecordSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  nome: z.string().nullable(),
  telefone: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  tipoUsuario: tipoUsuarioPerfilSchema.nullable(),
  platformRole: platformRoleSchema,
  createdAt: z.number().int(),
});

export type UserRecord = z.infer<typeof userRecordSchema>;
