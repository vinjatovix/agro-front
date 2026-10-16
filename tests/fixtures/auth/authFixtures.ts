import type {
  AuthSession,
  AuthUser,
  JwtPayload
} from '../../../src/types/auth';

function toBase64Url(payload: unknown): string {
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function createTestJwt(
  payloadOverrides: Partial<JwtPayload> = {}
): string {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload: JwtPayload = {
    id: '00000000-0000-4000-8000-000000000001',
    email: 'hortelano@example.com',
    username: 'hortelano',
    roles: ['user'],
    iat: now,
    exp: now + 7200,
    ...payloadOverrides
  };
  return `${toBase64Url(header)}.${toBase64Url(payload)}.signature`;
}

export function buildAuthUser(overrides: Partial<AuthUser> = {}): AuthUser {
  return {
    id: '00000000-0000-4000-8000-000000000001',
    email: 'hortelano@example.com',
    username: 'hortelano',
    roles: ['user'],
    ...overrides
  };
}

export function buildJwtPayload(
  overrides: Partial<JwtPayload> = {}
): JwtPayload {
  const now = Math.floor(Date.now() / 1000);
  return {
    id: '00000000-0000-4000-8000-000000000001',
    email: 'hortelano@example.com',
    username: 'hortelano',
    roles: ['user'],
    iat: now,
    exp: now + 7200,
    ...overrides
  };
}

export function buildAuthSession(
  overrides: Partial<AuthSession> = {}
): AuthSession {
  const user = buildAuthUser(overrides.user);
  const now = Math.floor(Date.now() / 1000);
  return {
    token: createTestJwt(),
    user,
    expiresAt: now + 7200,
    ...overrides
  };
}

export const VALID_TEST_TOKEN = createTestJwt();
export const EXPIRED_TEST_TOKEN = createTestJwt({
  exp: 1000000000
});
export const ADMIN_TEST_TOKEN = createTestJwt({
  roles: ['admin', 'user'],
  username: 'admin'
});
