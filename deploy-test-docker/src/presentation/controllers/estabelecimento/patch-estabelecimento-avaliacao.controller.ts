import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { patchEstabelecimentoAvaliacaoBodySchema } from '@lilo-hub/contracts';
import { PatchEstabelecimentoAvaliacaoUsecase } from '../../../application/usecases/patch-estabelecimento-avaliacao.usecase.js';
import { JwtAuthGuard } from '../../../infra/auth/jwt-auth.guard.js';
import { CurrentUserId } from '../../decorators/current-user.decorator.js';

@ApiTags('estabelecimentos')
@Controller('estabelecimentos')
export class PatchEstabelecimentoAvaliacaoController {
  constructor(private readonly patchAvaliacao: PatchEstabelecimentoAvaliacaoUsecase) {}

  @Patch(':id/avaliacoes/:avaliacaoId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Responde avaliação',
    operationId: 'patchEstabelecimentoAvaliacao',
  })
  execute(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Param('avaliacaoId') avaliacaoId: string,
    @Body() body: unknown,
  ) {
    const parsed = patchEstabelecimentoAvaliacaoBodySchema.parse(body);
    return this.patchAvaliacao.execute(userId, id, avaliacaoId, parsed);
  }
}
