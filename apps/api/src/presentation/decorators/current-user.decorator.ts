import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { JwtAccessPayload } from '../../domain/model/jwt-payload.model.js';

export const CurrentJwtUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtAccessPayload => {
    const req = ctx.switchToHttp().getRequest<{ user: JwtAccessPayload }>();
    return req.user;
  },
);

export const CurrentUserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest<{ user: JwtAccessPayload }>();
    return req.user.sub;
  },
);
