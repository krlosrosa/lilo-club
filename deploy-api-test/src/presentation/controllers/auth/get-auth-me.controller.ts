import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetAuthMeUsecase } from '../../../application/usecases/get-auth-me.usecase.js';
import { JwtAuthGuard } from '../../../infra/auth/jwt-auth.guard.js';
import { CurrentUserId } from '../../decorators/current-user.decorator.js';

@Controller('auth')
export class GetAuthMeController {
  constructor(private readonly getAuthMe: GetAuthMeUsecase) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  execute(@CurrentUserId() userId: string) {
    return this.getAuthMe.execute(userId);
  }
}
