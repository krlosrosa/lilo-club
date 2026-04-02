import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthenticateWithGoogleUsecase } from '../../application/usecases/authenticate-with-google.usecase.js';
import { GetAuthMeUsecase } from '../../application/usecases/get-auth-me.usecase.js';
import { PatchAuthMeProfileUsecase } from '../../application/usecases/patch-auth-me-profile.usecase.js';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.js';
import { JwtStrategy } from '../auth/strategies/jwt.strategy.js';
import { GoogleStrategy } from '../auth/strategies/google.strategy.js';
import { UserRepositoryService } from '../db/user/user.service.js';
import { GoogleOAuthCallbackController } from '../../presentation/controllers/auth/google-oauth-callback.controller.js';
import { GetAuthMeController } from '../../presentation/controllers/auth/get-auth-me.controller.js';
import { PatchAuthMeProfileController } from '../../presentation/controllers/auth/patch-auth-me-profile.controller.js';
import { PostAuthLogoutController } from '../../presentation/controllers/auth/post-auth-logout.controller.js';
import { RedirectGoogleAuthController } from '../../presentation/controllers/auth/redirect-google-auth.controller.js';

@Module({
  imports: [
    PassportModule.register({ session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          // jsonwebtoken aceita string (ex. "1h"); tipos do @nestjs/jwt 11 restringem a ms.StringValue
          expiresIn: config.getOrThrow<string>('JWT_EXPIRES_IN') as `${number}${'ms' | 's' | 'm' | 'h' | 'd' | 'w' | 'y'}`,
        },
      }),
    }),
  ],
  providers: [
    GoogleStrategy,
    JwtStrategy,
    AuthenticateWithGoogleUsecase,
    GetAuthMeUsecase,
    PatchAuthMeProfileUsecase,
    { provide: USER_REPOSITORY, useClass: UserRepositoryService },
  ],
  controllers: [
    RedirectGoogleAuthController,
    GoogleOAuthCallbackController,
    GetAuthMeController,
    PatchAuthMeProfileController,
    PostAuthLogoutController,
  ],
  exports: [USER_REPOSITORY],
})
export class AuthModule {}
