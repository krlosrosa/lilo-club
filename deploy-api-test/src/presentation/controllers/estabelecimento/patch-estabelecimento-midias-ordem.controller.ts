import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { patchMidiasOrdemBodySchema } from '@lilo-hub/contracts';
import { PatchEstabelecimentoMidiasOrdemUsecase } from '../../../application/usecases/patch-estabelecimento-midias-ordem.usecase.js';
import { JwtAuthGuard } from '../../../infra/auth/jwt-auth.guard.js';
import { CurrentUserId } from '../../decorators/current-user.decorator.js';

@ApiTags('estabelecimentos')
@Controller('estabelecimentos')
export class PatchEstabelecimentoMidiasOrdemController {
  constructor(private readonly patchOrdem: PatchEstabelecimentoMidiasOrdemUsecase) {}

  @Patch(':id/midias/ordem')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Reordena mídias',
    operationId: 'patchEstabelecimentoMidiasOrdem',
  })
  execute(@CurrentUserId() userId: string, @Param('id') id: string, @Body() body: unknown) {
    const parsed = patchMidiasOrdemBodySchema.parse(body);
    return this.patchOrdem.execute(userId, id, parsed);
  }
}
