import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { buildOAuthReturnState, normalizeReturnPath } from './oauth-return-url.js';

@Injectable()
export class GoogleOAuthInitGuard extends AuthGuard('google') {
  constructor(private readonly config: ConfigService) {
    super();
  }

  override getAuthenticateOptions(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<{ get(name: string): string | undefined; query?: { returnTo?: unknown } }>();
    const host = req.get('host') ?? '';
    const returnPath = normalizeReturnPath(req.query?.returnTo);
    const secret = this.config.getOrThrow<string>('JWT_SECRET');
    const state = buildOAuthReturnState(host, returnPath, secret);
    return {
      scope: ['email', 'profile'],
      state,
    };
  }
}
