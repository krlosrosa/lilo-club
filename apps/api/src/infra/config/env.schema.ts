import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z
    .string()
    .min(1)
    .transform((s) => s.trim())
    .refine((u) => u.startsWith('postgres'), {
      message: 'DATABASE_URL tem de começar por postgresql:// ou postgres://',
    }),
  PORT: z.coerce.number().optional().default(3001),
  SWAGGER_ENABLED: z.preprocess(
    (val: unknown) => {
      if (val === undefined || val === '') return true;
      if (typeof val === 'boolean') return val;
      const s = String(val).toLowerCase();
      if (s === 'false' || s === '0' || s === 'no') return false;
      return true;
    },
    z.boolean(),
  ),
  CORS_ORIGINS: z.string(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_CALLBACK_URL: z.string().url(),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default('1h'),
  JWT_COOKIE_NAME: z.string().default('access_token'),
  JWT_COOKIE_MAX_AGE_MS: z.coerce.number().default(3_600_000),
  /** Definir em produção com multi-subdomínio (ex.: DOMAIN sem https) para o JWT ser enviado em *.domínio. */
  JWT_COOKIE_DOMAIN: z.string().min(1).optional(),
  WEB_APP_URL: z.string().url(),
  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET: z.string().min(1),
  R2_PUBLIC_BASE_URL: z
    .union([z.string().url(), z.literal('')])
    .optional(),
  OPENAI_API_KEY: z.string().min(1).optional(),
  OPENAI_MODEL: z.string().min(1).default('gpt-4o-mini'),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  return envSchema.parse(config);
}
