import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { patchEstabelecimentoEnderecoBodySchema } from '@lilo-hub/contracts';
import { PatchEstabelecimentoEnderecoUsecase } from '../../../application/usecases/patch-estabelecimento-endereco.usecase.js';
import { JwtAuthGuard } from '../../../infra/auth/jwt-auth.guard.js';
import { CurrentUserId } from '../../decorators/current-user.decorator.js';

@ApiTags('estabelecimentos')
@Controller('estabelecimentos')
export class PatchEstabelecimentoEnderecoController {
  constructor(private readonly patchEndereco: PatchEstabelecimentoEnderecoUsecase) {}

  @Patch(':id/endereco')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Atualiza endereço',
    operationId: 'patchEstabelecimentoEndereco',
  })
  execute(@CurrentUserId() userId: string, @Param('id') id: string, @Body() body: unknown) {
    const parsed = patchEstabelecimentoEnderecoBodySchema.parse(body);
    return this.patchEndereco.execute(userId, id, parsed);
  }
}
