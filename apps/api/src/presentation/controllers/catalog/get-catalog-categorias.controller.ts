import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListCatalogCategoriasUsecase } from '../../../application/usecases/list-catalog-categorias.usecase.js';

@ApiTags('catalog')
@Controller('catalog')
export class GetCatalogCategoriasController {
  constructor(private readonly listCategorias: ListCatalogCategoriasUsecase) {}

  @Get('categorias')
  @ApiOperation({ summary: 'Lista categorias do catálogo', operationId: 'listCatalogCategorias' })
  execute() {
    return this.listCategorias.execute();
  }
}
