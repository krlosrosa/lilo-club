import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ListEstabelecimentosUsecase } from '../../../application/usecases/list-estabelecimentos.usecase.js';
import { JwtAuthGuard } from '../../../infra/auth/jwt-auth.guard.js';
import { CurrentUserId } from '../../decorators/current-user.decorator.js';

@ApiTags('estabelecimentos')
@Controller('estabelecimentos')
export class ListEstabelecimentosController {
  constructor(private readonly listEstabelecimentos: ListEstabelecimentosUsecase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lista estabelecimentos da conta', operationId: 'listEstabelecimentos' })
  @ApiQuery({ name: 'search', required: false })
  execute(@CurrentUserId() userId: string, @Query('search') search?: string) {
    return this.listEstabelecimentos.execute(userId, search);
  }
}
