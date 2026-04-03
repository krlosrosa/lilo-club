import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './config/migrations/index.js';
import type { DrizzleClient } from './drizzle.types.js';
import { parseDatabaseUrl } from './resolve-database-url.js';

export function createDrizzleClient(config: ConfigService): DrizzleClient {
  const connectionString = parseDatabaseUrl(
    config.getOrThrow<string>('DATABASE_URL'),
  );
  const pool = new Pool({ connectionString });
  return drizzle(pool, { schema });
}
