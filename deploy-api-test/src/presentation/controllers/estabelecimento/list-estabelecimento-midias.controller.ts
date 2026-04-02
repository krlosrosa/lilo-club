import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListEstabelecimentoMidiasUsecase } from '../../../application/usecases/list-estabelecimento-midias.usecase.js';
import { JwtAuthGuard } from '../../../infra/auth/jwt-auth.guard.js';
import { CurrentUserId } from '../../decorators/current-user.decorator.js';

@ApiTags('estabelecimentos')
@Controller('estabelecimentos')
export class ListEstabelecimentoMidiasController {
  constructor(private readonly listMidias: ListEstabelecimentoMidiasUsecase) {}

  @Get(':id/midias')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lista mídias', operationId: 'listEstabelecimentoMidias' })
  execute(@CurrentUserId() userId: string, @Param('id') id: string) {
    return this.listMidias.execute(userId, id);
  }
}
