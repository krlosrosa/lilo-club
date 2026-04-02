import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import type { UserRecord } from '../../../domain/model/user.model.js';

@Controller('auth')
export class GoogleOAuthCallbackController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(
    @Req() req: { user: UserRecord },
    @Res() res: Response,
  ): Promise<void> {
    const user = req.user;
    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      platformRole: user.platformRole,
    });
    const cookieName = this.config.getOrThrow<string>('JWT_COOKIE_NAME');
    const maxAge = this.config.getOrThrow<number>('JWT_COOKIE_MAX_AGE_MS');
    const webAppUrl = this.config.getOrThrow<string>('WEB_APP_URL');
    const isProd = this.config.get<string>('NODE_ENV') === 'production';
    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge,
    });
    const redirectUrl = new URL('/auth/callback', webAppUrl);
    res.redirect(redirectUrl.href);
  }
}
