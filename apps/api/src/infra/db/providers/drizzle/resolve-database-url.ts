/**
 * PostgreSQL connection string from `DATABASE_URL` (required at runtime).
 * Example: postgresql://postgres:postgres@localhost:5432/lilo_hub
 *
 * Use in Nest via `ConfigService.getOrThrow<string>('DATABASE_URL')` after `EnvModule` validation;
 * scripts (`db:migrate`, `db:seed`) call `resolveDatabaseUrl()` which reads `process.env` directly.
 */
export function parseDatabaseUrl(raw: string | undefined): string {
  const url = raw?.trim();
  if (!url) {
    throw new Error(
      'DATABASE_URL está vazia ou não definida. Em apps/api/.env define uma linha sem comentários, ex.: ' +
        'DATABASE_URL=postgresql://USER:PASSWORD@ep-xxx.region.aws.neon.tech/nome_db?sslmode=require',
    );
  }
  if (!url.startsWith('postgres')) {
    throw new Error('DATABASE_URL tem de começar por postgresql:// ou postgres://');
  }
  return url;
}

export function resolveDatabaseUrl(): string {
  return parseDatabaseUrl(process.env.DATABASE_URL);
}
