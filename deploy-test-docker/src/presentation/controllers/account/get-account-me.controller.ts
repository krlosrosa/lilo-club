import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetAccountMeUsecase } from '../../../application/usecases/get-account-me.usecase.js';
import { JwtAuthGuard } from '../../../infra/auth/jwt-auth.guard.js';
import { CurrentUserId } from '../../decorators/current-user.decorator.js';

@ApiTags('accounts')
@Controller('accounts')
export class GetAccountMeController {
  constructor(private readonly getAccountMe: GetAccountMeUsecase) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Conta e plano do usuário autenticado', operationId: 'getAccountMe' })
  @ApiResponse({ status: 200, description: 'Resumo da conta' })
  execute(@CurrentUserId() userId: string) {
    return this.getAccountMe.execute(userId);
  }
}
