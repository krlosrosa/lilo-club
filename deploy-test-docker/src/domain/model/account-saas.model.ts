import { z } from 'zod';
import { accountMemberRoleSchema, subscriptionStatusSchema } from './guia.enums.js';

export const accountRecordSchema = z.object({
  id: z.string().uuid(),
  nome: z.string().min(1),
  slug: z.string().min(1).nullable(),
  stripeCustomerId: z.string().nullable(),
  createdAt: z.number().int(),
  updatedAt: z.number().int(),
});

export type AccountRecord = z.infer<typeof accountRecordSchema>;

export const accountUserRecordSchema = z.object({
  id: z.string().uuid(),
  accountId: z.string().uuid(),
  userId: z.string().uuid(),
  role: accountMemberRoleSchema,
  createdAt: z.number().int(),
});

export type AccountUserRecord = z.infer<typeof accountUserRecordSchema>;

export const planRecordSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  nome: z.string().min(1),
  maxEstabelecimentos: z.number().int().nonnegative(),
  maxMidiasPorEstabelecimento: z.number().int().nonnegative().nullable(),
  seloPremium: z.boolean(),
  ordem: z.number().int(),
  createdAt: z.number().int(),
});

export type PlanRecord = z.infer<typeof planRecordSchema>;

export const subscriptionRecordSchema = z.object({
  id: z.string().uuid(),
  accountId: z.string().uuid(),
  planId: z.string().uuid(),
  status: subscriptionStatusSchema,
  providerSubscriptionId: z.string().nullable(),
  currentPeriodStart: z.number().int().nullable(),
  currentPeriodEnd: z.number().int().nullable(),
  cancelAtPeriodEnd: z.boolean().nullable(),
  createdAt: z.number().int(),
});

export type SubscriptionRecord = z.infer<typeof subscriptionRecordSchema>;

export const moduloRecordSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  nome: z.string().min(1),
  descricao: z.string().nullable(),
  ordem: z.number().int(),
});

export type ModuloRecord = z.infer<typeof moduloRecordSchema>;
