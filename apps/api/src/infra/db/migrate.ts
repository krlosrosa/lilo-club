/**
 * Applies SQL files from `apps/api/drizzle` (see drizzle/meta/_journal.json).
 * Run: pnpm --filter @lilo-hub/api db:migrate
 */
import './load-api-env.js';
import path from 'node:path';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import { resolveDatabaseUrl } from './providers/drizzle/resolve-database-url.js';

async function main(): Promise<void> {
  const pool = new Pool({ connectionString: resolveDatabaseUrl() });
  const db = drizzle(pool);
  try {
    await migrate(db, { migrationsFolder: path.join(process.cwd(), 'drizzle') });
  } finally {
    await pool.end();
  }
  // eslint-disable-next-line no-console -- CLI
  console.log('Migrations applied OK.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
