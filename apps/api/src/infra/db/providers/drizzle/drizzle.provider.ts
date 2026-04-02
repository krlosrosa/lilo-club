import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './config/migrations/index.js';
import type { DrizzleClient } from './drizzle.types.js';
import { resolveDatabaseUrl } from './resolve-database-url.js';

export function createDrizzleClient(): DrizzleClient {
  const pool = new Pool({ connectionString: resolveDatabaseUrl() });
  return drizzle(pool, { schema });
}
