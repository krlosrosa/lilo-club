import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetEstabelecimentoHorariosUsecase } from '../../../application/usecases/get-estabelecimento-horarios.usecase.js';
import { JwtAuthGuard } from '../../../infra/auth/jwt-auth.guard.js';
import { CurrentUserId } from '../../decorators/current-user.decorator.js';

@ApiTags('estabelecimentos')
@Controller('estabelecimentos')
export class GetEstabelecimentoHorariosController {
  constructor(private readonly getHorarios: GetEstabelecimentoHorariosUsecase) {}

  @Get(':id/horarios')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Horários do estabelecimento', operationId: 'getEstabelecimentoHorarios' })
  execute(@CurrentUserId() userId: string, @Param('id') id: string) {
    return this.getHorarios.execute(userId, id);
  }
}
