import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { listAvaliacoesQuerySchema } from '@lilo-hub/contracts';
import { ListEstabelecimentoAvaliacoesUsecase } from '../../../application/usecases/list-estabelecimento-avaliacoes.usecase.js';
import { JwtAuthGuard } from '../../../infra/auth/jwt-auth.guard.js';
import { CurrentUserId } from '../../decorators/current-user.decorator.js';

@ApiTags('estabelecimentos')
@Controller('estabelecimentos')
export class ListEstabelecimentoAvaliacoesController {
  constructor(private readonly listAvaliacoes: ListEstabelecimentoAvaliacoesUsecase) {}

  @Get(':id/avaliacoes')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lista avaliações', operationId: 'listEstabelecimentoAvaliacoes' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  execute(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Query() query: Record<string, string | undefined>,
  ) {
    const q = listAvaliacoesQuerySchema.parse(query);
    return this.listAvaliacoes.execute(userId, id, q.page, q.pageSize);
  }
}
