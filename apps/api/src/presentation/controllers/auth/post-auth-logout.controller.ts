import { Controller, Post, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { CookieOptions, Response } from 'express';

@Controller('auth')
export class PostAuthLogoutController {
  constructor(private readonly config: ConfigService) {}

  @Post('logout')
  execute(@Res() res: Response): void {
    const cookieName = this.config.getOrThrow<string>('JWT_COOKIE_NAME');
    const isProd = this.config.get<string>('NODE_ENV') === 'production';
    const cookieDomain = this.config.get<string>('JWT_COOKIE_DOMAIN');
    const clearOpts: CookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
    };
    if (cookieDomain) {
      clearOpts.domain = cookieDomain;
    }
    res.clearCookie(cookieName, clearOpts);
    res.status(204).end();
  }
}
