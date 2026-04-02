import { z } from 'zod';

export const platformRoleSchema = z.enum(['super_admin', 'none']);
export type PlatformRole = z.infer<typeof platformRoleSchema>;

export const tipoUsuarioPerfilSchema = z.enum(['cliente', 'dono', 'parceiro']);
export type TipoUsuarioPerfil = z.infer<typeof tipoUsuarioPerfilSchema>;

export const accountMemberRoleSchema = z.enum(['owner', 'admin', 'member']);
export type AccountMemberRole = z.infer<typeof accountMemberRoleSchema>;

export const subscriptionStatusSchema = z.enum([
  'trialing',
  'active',
  'past_due',
  'canceled',
]);
export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;

export const estabelecimentoStatusSchema = z.enum(['rascunho', 'publicado']);
export type EstabelecimentoStatus = z.infer<typeof estabelecimentoStatusSchema>;

export const midiaTipoSchema = z.enum(['logo', 'capa', 'galeria']);
export type MidiaTipo = z.infer<typeof midiaTipoSchema>;
