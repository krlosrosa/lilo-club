import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetEstabelecimentoEnderecoUsecase } from '../../../application/usecases/get-estabelecimento-endereco.usecase.js';
import { JwtAuthGuard } from '../../../infra/auth/jwt-auth.guard.js';
import { CurrentUserId } from '../../decorators/current-user.decorator.js';

@ApiTags('estabelecimentos')
@Controller('estabelecimentos')
export class GetEstabelecimentoEnderecoController {
  constructor(private readonly getEndereco: GetEstabelecimentoEnderecoUsecase) {}

  @Get(':id/endereco')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Endereço do estabelecimento', operationId: 'getEstabelecimentoEndereco' })
  execute(@CurrentUserId() userId: string, @Param('id') id: string) {
    return this.getEndereco.execute(userId, id);
  }
}
