import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthenticateWithGoogleUsecase } from '../../../application/usecases/authenticate-with-google.usecase.js';
import { OAUTH_PROVIDER_GOOGLE } from '../../../domain/auth.constants.js';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    config: ConfigService,
    private readonly authenticateWithGoogle: AuthenticateWithGoogleUsecase,
  ) {
    super({
      clientID: config.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: config.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: config.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile) {
    const email = profile.emails?.[0]?.value;
    if (!email) {
      throw new UnauthorizedException('Google account has no email');
    }
    const providerUserId = profile.id;
    if (!providerUserId) {
      throw new UnauthorizedException('Invalid Google profile');
    }
    return this.authenticateWithGoogle.execute({
      provider: OAUTH_PROVIDER_GOOGLE,
      providerUserId,
      email,
      nome: profile.displayName ?? null,
      avatarUrl: profile.photos?.[0]?.value ?? null,
    });
  }
}
