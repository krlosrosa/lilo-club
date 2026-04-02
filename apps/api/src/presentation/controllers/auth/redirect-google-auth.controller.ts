import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class RedirectGoogleAuthController {
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth(): void {
    /* Passport inicia redirect para Google */
  }
}
