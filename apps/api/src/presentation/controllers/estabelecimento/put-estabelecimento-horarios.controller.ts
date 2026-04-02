import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { putEstabelecimentoHorariosBodySchema } from '@lilo-hub/contracts';
import { PutEstabelecimentoHorariosUsecase } from '../../../application/usecases/put-estabelecimento-horarios.usecase.js';
import { JwtAuthGuard } from '../../../infra/auth/jwt-auth.guard.js';
import { CurrentUserId } from '../../decorators/current-user.decorator.js';

@ApiTags('estabelecimentos')
@Controller('estabelecimentos')
export class PutEstabelecimentoHorariosController {
  constructor(private readonly putHorarios: PutEstabelecimentoHorariosUsecase) {}

  @Put(':id/horarios')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Substitui todos os intervalos de horário',
    operationId: 'putEstabelecimentoHorarios',
  })
  execute(@CurrentUserId() userId: string, @Param('id') id: string, @Body() body: unknown) {
    const parsed = putEstabelecimentoHorariosBodySchema.parse(body);
    return this.putHorarios.execute(userId, id, parsed);
  }
}
