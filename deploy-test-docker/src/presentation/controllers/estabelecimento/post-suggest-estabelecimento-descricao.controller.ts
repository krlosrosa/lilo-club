import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { postSuggestEstabelecimentoDescricaoBodySchema } from '@lilo-hub/contracts';
import { SuggestEstabelecimentoDescricaoUsecase } from '../../../application/usecases/suggest-estabelecimento-descricao.usecase.js';
import { JwtAuthGuard } from '../../../infra/auth/jwt-auth.guard.js';
import { CurrentUserId } from '../../decorators/current-user.decorator.js';

@ApiTags('estabelecimentos')
@Controller('estabelecimentos')
export class PostSuggestEstabelecimentoDescricaoController {
  constructor(private readonly suggest: SuggestEstabelecimentoDescricaoUsecase) {}

  @Post(':id/suggest-descricao')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Sugere descrição editorial melhorada (IA)',
    operationId: 'postSuggestEstabelecimentoDescricao',
  })
  execute(@CurrentUserId() userId: string, @Param('id') estabelecimentoId: string, @Body() body: unknown) {
    const parsed = postSuggestEstabelecimentoDescricaoBodySchema.parse(body ?? {});
    return this.suggest.execute(userId, estabelecimentoId, parsed.rascunho);
  }
}
