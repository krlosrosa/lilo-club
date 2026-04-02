import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { postSuggestEstabelecimentoHorarioBodySchema } from '@lilo-hub/contracts';
import { SuggestEstabelecimentoHorarioUsecase } from '../../../application/usecases/suggest-estabelecimento-horario.usecase.js';
import { JwtAuthGuard } from '../../../infra/auth/jwt-auth.guard.js';
import { CurrentUserId } from '../../decorators/current-user.decorator.js';

@ApiTags('estabelecimentos')
@Controller('estabelecimentos')
export class PostSuggestEstabelecimentoHorarioController {
  constructor(private readonly suggest: SuggestEstabelecimentoHorarioUsecase) {}

  @Post(':id/suggest-horarios')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Interpreta horários em texto livre (IA)',
    operationId: 'postSuggestEstabelecimentoHorario',
  })
  execute(
    @CurrentUserId() userId: string,
    @Param('id') estabelecimentoId: string,
    @Body() body: unknown,
  ) {
    const parsed = postSuggestEstabelecimentoHorarioBodySchema.parse(body ?? {});
    return this.suggest.execute(userId, estabelecimentoId, parsed.texto);
  }
}
