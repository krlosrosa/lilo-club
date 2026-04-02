import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { createEstabelecimentoBodySchema } from '@lilo-hub/contracts';
import { CreateEstabelecimentoUsecase } from '../../../application/usecases/create-estabelecimento.usecase.js';
import { JwtAuthGuard } from '../../../infra/auth/jwt-auth.guard.js';
import { CurrentUserId } from '../../decorators/current-user.decorator.js';

@ApiTags('estabelecimentos')
@Controller('estabelecimentos')
export class CreateEstabelecimentoController {
  constructor(private readonly createEstabelecimento: CreateEstabelecimentoUsecase) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cria estabelecimento', operationId: 'createEstabelecimento' })
  execute(@CurrentUserId() userId: string, @Body() body: unknown) {
    const parsed = createEstabelecimentoBodySchema.parse(body);
    return this.createEstabelecimento.execute(userId, parsed);
  }
}
