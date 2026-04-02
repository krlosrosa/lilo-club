import { defineConfig } from 'drizzle-kit';

const databaseUrl =
  process.env.DATABASE_URL ?? 'file:./data/app.db';

export default defineConfig({
  schema: './src/infra/db/providers/drizzle/config/migrations/index.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: databaseUrl,
  },
});
