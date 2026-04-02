import { Module } from '@nestjs/common';
import { ListCatalogCategoriasUsecase } from '../../application/usecases/list-catalog-categorias.usecase.js';
import { ListCatalogCidadesUsecase } from '../../application/usecases/list-catalog-cidades.usecase.js';
import { GetCatalogCategoriasController } from '../../presentation/controllers/catalog/get-catalog-categorias.controller.js';
import { GetCatalogCidadesController } from '../../presentation/controllers/catalog/get-catalog-cidades.controller.js';

@Module({
  controllers: [GetCatalogCidadesController, GetCatalogCategoriasController],
  providers: [ListCatalogCidadesUsecase, ListCatalogCategoriasUsecase],
})
export class CatalogModule {}
