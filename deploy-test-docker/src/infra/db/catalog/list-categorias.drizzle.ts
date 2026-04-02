import { asc } from 'drizzle-orm';
import { categorias } from '../providers/drizzle/config/migrations/index.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';

export type CategoriaCatalogRow = {
  id: string;
  nome: string;
  ordem: number;
};

export async function listCategoriasCatalogDb(db: DrizzleClient): Promise<CategoriaCatalogRow[]> {
  const rows = await db
    .select({
      id: categorias.id,
      nome: categorias.nome,
      ordem: categorias.ordem,
    })
    .from(categorias)
    .orderBy(asc(categorias.ordem), asc(categorias.nome));

  return rows;
}
