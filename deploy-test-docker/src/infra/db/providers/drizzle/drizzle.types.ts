import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import type * as schema from './config/migrations/index.js';

export type DrizzleClient = BetterSQLite3Database<typeof schema>;
