import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { z } from 'zod';
import { SuggestAvaliacaoRespostaUsecase } from '../../../application/usecases/suggest-avaliacao-resposta.usecase.js';
import { JwtAuthGuard } from '../../../infra/auth/jwt-auth.guard.js';
import { CurrentUserId } from '../../decorators/current-user.decorator.js';

const postSuggestAvaliacaoRespostaBodySchema = z.object({
  tom: z.enum(['formal', 'amigavel', 'objetivo']).optional(),
});

@ApiTags('estabelecimentos')
@Controller('estabelecimentos')
export class PostSuggestAvaliacaoRespostaController {
  constructor(private readonly suggest: SuggestAvaliacaoRespostaUsecase) {}

  @Post(':id/avaliacoes/:avaliacaoId/suggest-resposta')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Sugere resposta à avaliação (IA)',
    operationId: 'postSuggestAvaliacaoResposta',
  })
  execute(
    @CurrentUserId() userId: string,
    @Param('id') estabelecimentoId: string,
    @Param('avaliacaoId') avaliacaoId: string,
    @Body() body: unknown,
  ) {
    const parsed = postSuggestAvaliacaoRespostaBodySchema.parse(body ?? {});
    return this.suggest.execute(userId, estabelecimentoId, avaliacaoId, parsed.tom);
  }
}
