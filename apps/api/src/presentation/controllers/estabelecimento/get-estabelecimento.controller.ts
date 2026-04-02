import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetEstabelecimentoUsecase } from '../../../application/usecases/get-estabelecimento.usecase.js';
import { JwtAuthGuard } from '../../../infra/auth/jwt-auth.guard.js';
import { CurrentUserId } from '../../decorators/current-user.decorator.js';

@ApiTags('estabelecimentos')
@Controller('estabelecimentos')
export class GetEstabelecimentoController {
  constructor(private readonly getEstabelecimento: GetEstabelecimentoUsecase) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Detalhe do estabelecimento', operationId: 'getEstabelecimento' })
  execute(@CurrentUserId() userId: string, @Param('id') id: string) {
    return this.getEstabelecimento.execute(userId, id);
  }
}
