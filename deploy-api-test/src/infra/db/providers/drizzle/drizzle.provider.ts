import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './config/migrations/index.js';
import type { DrizzleClient } from './drizzle.types.js';
import { ensureSqliteDirectory, resolveSqlitePath } from './resolve-sqlite-path.js';

export function createDrizzleClient(): DrizzleClient {
  const sqlitePath = resolveSqlitePath();
  ensureSqliteDirectory(sqlitePath);
  const sqlite = new Database(sqlitePath);
  sqlite.pragma('foreign_keys = ON');
  return drizzle(sqlite, { schema });
}
