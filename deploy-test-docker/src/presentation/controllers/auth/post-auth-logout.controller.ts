import { Controller, Post, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';

@Controller('auth')
export class PostAuthLogoutController {
  constructor(private readonly config: ConfigService) {}

  @Post('logout')
  execute(@Res() res: Response): void {
    const cookieName = this.config.getOrThrow<string>('JWT_COOKIE_NAME');
    const isProd = this.config.get<string>('NODE_ENV') === 'production';
    res.clearCookie(cookieName, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
    });
    res.status(204).end();
  }
}
