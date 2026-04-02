import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { platformRoleSchema } from '../../../domain/model/guia.enums.js';
import type { JwtAccessPayload } from '../../../domain/model/jwt-payload.model.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    const cookieName = config.get<string>('JWT_COOKIE_NAME') ?? 'access_token';
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const raw = req?.cookies?.[cookieName];
          if (typeof raw === 'string' && raw.length > 0) return raw;
          return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  validate(payload: {
    sub: string;
    email: string;
    platformRole: string;
  }): JwtAccessPayload {
    return {
      sub: payload.sub,
      email: payload.email,
      platformRole: platformRoleSchema.parse(payload.platformRole),
    };
  }
}
