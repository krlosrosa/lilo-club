import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type * as schema from './config/migrations/index.js';

export type DrizzleClient = NodePgDatabase<typeof schema>;
