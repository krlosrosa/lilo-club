/**
 * Applies SQL files from `apps/api/drizzle` (see drizzle/meta/_journal.json).
 * Run: pnpm --filter @lilo-hub/api db:migrate
 */
import path from 'node:path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { ensureSqliteDirectory, resolveSqlitePath } from './providers/drizzle/resolve-sqlite-path.js';

const sqlitePath = resolveSqlitePath();
ensureSqliteDirectory(sqlitePath);
const sqlite = new Database(sqlitePath);
sqlite.pragma('foreign_keys = ON');
const db = drizzle(sqlite);
migrate(db, { migrationsFolder: path.join(process.cwd(), 'drizzle') });
sqlite.close();
// eslint-disable-next-line no-console -- CLI
console.log('Migrations applied OK.');
