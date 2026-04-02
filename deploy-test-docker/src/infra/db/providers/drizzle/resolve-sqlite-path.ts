import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Resolves the SQLite file path from `DATABASE_URL` (default `file:./data/app.db`)
 * or `SQLITE_PATH` (relative path under cwd, takes precedence when set).
 */
export function resolveSqlitePath(): string {
  if (process.env.SQLITE_PATH) {
    return resolve(process.cwd(), process.env.SQLITE_PATH);
  }
  const url = process.env.DATABASE_URL ?? 'file:./data/app.db';
  if (!url.startsWith('file:')) {
    return resolve(process.cwd(), url);
  }
  const afterScheme = url.slice('file:'.length);
  if (
    afterScheme.startsWith('/') ||
    afterScheme.startsWith('\\') ||
    /^[a-zA-Z]:/.test(afterScheme)
  ) {
    return fileURLToPath(new URL(url));
  }
  return resolve(process.cwd(), afterScheme.replace(/^\.\//, ''));
}

export function ensureSqliteDirectory(sqlitePath: string): void {
  mkdirSync(dirname(sqlitePath), { recursive: true });
}
