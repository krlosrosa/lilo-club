import { Inject, Injectable } from '@nestjs/common';
import { listCategoriasResponseSchema, type ListCategoriasResponse } from '@lilo-hub/contracts';
import { DRIZZLE_PROVIDER } from '../../infra/db/providers/drizzle/drizzle.constants.js';
import type { DrizzleClient } from '../../infra/db/providers/drizzle/drizzle.types.js';
import { listCategoriasCatalogDb } from '../../infra/db/catalog/list-categorias.drizzle.js';

@Injectable()
export class ListCatalogCategoriasUsecase {
  constructor(@Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient) {}

  async execute(): Promise<ListCategoriasResponse> {
    const items = await listCategoriasCatalogDb(this.db);
    return listCategoriasResponseSchema.parse({ items });
  }
}
