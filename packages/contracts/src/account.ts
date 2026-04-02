import { z } from 'zod';

export const accountMeResponseSchema = z.object({
  accountId: z.string().uuid(),
  accountNome: z.string(),
  planSlug: z.string(),
  planNome: z.string(),
  maxEstabelecimentos: z.number().int().nonnegative(),
  maxMidiasPorEstabelecimento: z.number().int().nonnegative().nullable(),
  seloPremium: z.boolean(),
  subscriptionStatus: z.enum(['trialing', 'active', 'past_due', 'canceled']),
});

export type AccountMeResponse = z.infer<typeof accountMeResponseSchema>;
