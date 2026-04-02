import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { patchEstabelecimentoBodySchema } from '@lilo-hub/contracts';
import { PatchEstabelecimentoUsecase } from '../../../application/usecases/patch-estabelecimento.usecase.js';
import { JwtAuthGuard } from '../../../infra/auth/jwt-auth.guard.js';
import { CurrentUserId } from '../../decorators/current-user.decorator.js';

@ApiTags('estabelecimentos')
@Controller('estabelecimentos')
export class PatchEstabelecimentoController {
  constructor(private readonly patchEstabelecimento: PatchEstabelecimentoUsecase) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Atualiza dados do estabelecimento', operationId: 'patchEstabelecimento' })
  execute(@CurrentUserId() userId: string, @Param('id') id: string, @Body() body: unknown) {
    const parsed = patchEstabelecimentoBodySchema.parse(body);
    return this.patchEstabelecimento.execute(userId, id, parsed);
  }
}
