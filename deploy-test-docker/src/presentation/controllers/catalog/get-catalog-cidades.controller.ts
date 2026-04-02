import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListCatalogCidadesUsecase } from '../../../application/usecases/list-catalog-cidades.usecase.js';

@ApiTags('catalog')
@Controller('catalog')
export class GetCatalogCidadesController {
  constructor(private readonly listCidades: ListCatalogCidadesUsecase) {}

  @Get('cidades')
  @ApiOperation({ summary: 'Lista cidades do catálogo', operationId: 'listCatalogCidades' })
  execute() {
    return this.listCidades.execute();
  }
}
