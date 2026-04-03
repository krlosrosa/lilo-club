import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { CookieOptions, Request, Response } from 'express';
import type { UserRecord } from '../../../domain/model/user.model.js';
import { isAllowedRedirectHost, parseOAuthReturnState } from '../../../infra/auth/oauth-return-url.js';

@Controller('auth')
export class GoogleOAuthCallbackController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(
    @Req() req: Request & { user: UserRecord },
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
    const secret = this.config.getOrThrow<string>('JWT_SECRET');
    const baseHostname = new URL(webAppUrl).hostname;
    const isProd = this.config.get<string>('NODE_ENV') === 'production';
    const cookieDomain = this.config.get<string>('JWT_COOKIE_DOMAIN');
    const cookieOpts: CookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge,
    };
    if (cookieDomain) {
      cookieOpts.domain = cookieDomain;
    }
    res.cookie(cookieName, token, cookieOpts);

    const fallback = new URL('/', webAppUrl);
    const state = req.query?.state;
    const target = parseOAuthReturnState(state, secret, baseHostname);
    if (!target) {
      res.redirect(fallback.href);
      return;
    }
    const fwdProto = req.get('x-forwarded-proto');
    const proto =
      typeof fwdProto === 'string' && fwdProto.length > 0
        ? fwdProto.split(',')[0].trim()
        : fallback.protocol.replace(':', '');
    const hostOnly = target.host.split(':')[0] ?? '';
    if (!isAllowedRedirectHost(hostOnly, baseHostname)) {
      res.redirect(fallback.href);
      return;
    }
    const redirectUrl = new URL(target.path, `${proto}://${target.host}`);
    res.redirect(redirectUrl.href);
  }
}
