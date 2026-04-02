/**
 * PostgreSQL connection string from `DATABASE_URL` (required at runtime).
 * Example: postgresql://postgres:postgres@localhost:5432/lilo_hub
 */
export function resolveDatabaseUrl(): string {
  const url = process.env.DATABASE_URL?.trim();
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
