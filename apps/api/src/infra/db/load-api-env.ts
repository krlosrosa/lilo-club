/**
 * Carrega `apps/api/.env` de forma fiável (build em `dist/` ou `tsx` a partir de `src/`).
 * Também procura `apps/api/.env` a subir a partir de `process.cwd()` se `__dirname` falhar.
 * `override: true` — vence DATABASE_URL antiga no ambiente (ex.: ...@host...).
 */
import { existsSync } from 'node:fs';
import path from 'node:path';
import { config } from 'dotenv';

function resolveApiEnvPath(): string | undefined {
  try {
    const fromModule = path.resolve(__dirname, '..', '..', '..', '.env');
    if (existsSync(fromModule)) return fromModule;
  } catch {
    /* __dirname indisponível em alguns runners */
  }

  let dir = process.cwd();
  for (let i = 0; i < 12; i++) {
    const candidate = path.join(dir, 'apps', 'api', '.env');
    if (existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return undefined;
}

const apiEnv = resolveApiEnvPath();
if (apiEnv) {
  config({ path: apiEnv, override: true });
  if (!process.env.DATABASE_URL?.trim()) {
    // eslint-disable-next-line no-console -- diagnóstico CLI
    console.warn(
      `[load-api-env] Ficheiro carregado (${apiEnv}) mas DATABASE_URL está vazia. ` +
        'Preenche DATABASE_URL com a connection string do teu Postgres (ex. Neon).',
    );
  }
}
