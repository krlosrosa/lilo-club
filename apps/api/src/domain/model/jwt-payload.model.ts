import type { PlatformRole } from './guia.enums.js';

/** Claims do access token JWT (API). */
export type JwtAccessPayload = {
  sub: string;
  email: string;
  platformRole: PlatformRole;
};
