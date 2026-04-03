import { createHmac, timingSafeEqual } from 'node:crypto';

export type OAuthReturnTarget = { host: string; path: string };

export function normalizeReturnPath(raw: unknown, fallback = '/'): string {
  if (typeof raw !== 'string') {
    return fallback;
  }
  const trimmed = raw.trim();
  if (trimmed.length === 0 || !trimmed.startsWith('/') || trimmed.startsWith('//')) {
    return fallback;
  }
  if (trimmed.includes('\\') || trimmed.length > 2048) {
    return fallback;
  }
  return trimmed;
}

/** Host may include port (e.g. localhost:3000). baseHostname must be without port. */
export function isAllowedRedirectHost(host: string, baseHostname: string): boolean {
  const h = host.split(':')[0]?.toLowerCase() ?? '';
  const base = baseHostname.split(':')[0]?.toLowerCase() ?? '';
  if (!h || !base) {
    return false;
  }
  return h === base || h.endsWith(`.${base}`);
}

type OAuthReturnPayload = {
  h: string;
  p: string;
  exp: number;
};

export function buildOAuthReturnState(host: string, returnPath: string, secret: string): string {
  const payload: OAuthReturnPayload = {
    h: host,
    p: returnPath,
    exp: Date.now() + 10 * 60_000,
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const sig = createHmac('sha256', secret).update(payloadB64).digest('base64url');
  return `${sig}.${payloadB64}`;
}

export function parseOAuthReturnState(
  state: unknown,
  secret: string,
  baseHostname: string,
): OAuthReturnTarget | null {
  if (typeof state !== 'string' || !state.includes('.')) {
    return null;
  }
  const dot = state.indexOf('.');
  const sig = state.slice(0, dot);
  const payloadB64 = state.slice(dot + 1);
  if (!sig || !payloadB64) {
    return null;
  }
  const expected = createHmac('sha256', secret).update(payloadB64).digest('base64url');
  try {
    if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
      return null;
    }
  } catch {
    return null;
  }
  let data: OAuthReturnPayload;
  try {
    data = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8')) as OAuthReturnPayload;
  } catch {
    return null;
  }
  if (typeof data.h !== 'string' || typeof data.p !== 'string' || typeof data.exp !== 'number') {
    return null;
  }
  if (data.exp < Date.now()) {
    return null;
  }
  if (!isAllowedRedirectHost(data.h, baseHostname)) {
    return null;
  }
  const path = normalizeReturnPath(data.p);
  return { host: data.h, path };
}
