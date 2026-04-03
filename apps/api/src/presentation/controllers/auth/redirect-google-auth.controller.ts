import { Controller, Get, UseGuards } from '@nestjs/common';
import { GoogleOAuthInitGuard } from '../../../infra/auth/google-oauth-init.guard.js';

@Controller('auth')
export class RedirectGoogleAuthController {
  @Get('google')
  @UseGuards(GoogleOAuthInitGuard)
  googleAuth(): void {
    /* Passport inicia redirect para Google */
  }
}
