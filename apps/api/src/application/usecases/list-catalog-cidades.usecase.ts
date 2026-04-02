import { Inject, Injectable } from '@nestjs/common';
import { listCidadesResponseSchema, type ListCidadesResponse } from '@lilo-hub/contracts';
import { DRIZZLE_PROVIDER } from '../../infra/db/providers/drizzle/drizzle.constants.js';
import type { DrizzleClient } from '../../infra/db/providers/drizzle/drizzle.types.js';
import { listCidadesCatalogDb } from '../../infra/db/catalog/list-cidades.drizzle.js';

@Injectable()
export class ListCatalogCidadesUsecase {
  constructor(@Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient) {}

  async execute(): Promise<ListCidadesResponse> {
    const items = await listCidadesCatalogDb(this.db);
    return listCidadesResponseSchema.parse({ items });
  }
}
