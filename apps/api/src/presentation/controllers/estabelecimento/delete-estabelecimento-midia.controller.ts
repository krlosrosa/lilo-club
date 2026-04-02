import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteEstabelecimentoMidiaUsecase } from '../../../application/usecases/delete-estabelecimento-midia.usecase.js';
import { JwtAuthGuard } from '../../../infra/auth/jwt-auth.guard.js';
import { CurrentUserId } from '../../decorators/current-user.decorator.js';

@ApiTags('estabelecimentos')
@Controller('estabelecimentos')
export class DeleteEstabelecimentoMidiaController {
  constructor(private readonly deleteMidia: DeleteEstabelecimentoMidiaUsecase) {}

  @Delete(':estabelecimentoId/midias/:midiaId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remove mídia', operationId: 'deleteEstabelecimentoMidia' })
  execute(
    @CurrentUserId() userId: string,
    @Param('midiaId') midiaId: string,
  ) {
    return this.deleteMidia.execute(userId, midiaId);
  }
}
