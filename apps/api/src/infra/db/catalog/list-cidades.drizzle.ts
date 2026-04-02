import { asc } from 'drizzle-orm';
import { cidades } from '../providers/drizzle/config/migrations/index.js';
import type { DrizzleClient } from '../providers/drizzle/drizzle.types.js';

export type CidadeCatalogRow = {
  id: string;
  nome: string;
  uf: string;
  slug: string;
};

export async function listCidadesCatalogDb(db: DrizzleClient): Promise<CidadeCatalogRow[]> {
  const rows = await db
    .select({
      id: cidades.id,
      nome: cidades.nome,
      uf: cidades.uf,
      slug: cidades.slug,
    })
    .from(cidades)
    .orderBy(asc(cidades.nome));

  return rows;
}
