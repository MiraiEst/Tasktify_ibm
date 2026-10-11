// Edge-compatible JWT verification using Web Crypto API
// This file is intentionally separate from lib/auth.ts which uses jsonwebtoken (Node.js only)

const COOKIE_NAME = 'tasktify_token';

export function cookieName(): string {
  return COOKIE_NAME;
}

// Decode JWT payload without verification (for Edge runtime)
// Full verification happens in API routes via lib/auth.ts (Node.js)
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    // Base64url decode the payload part
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// Check if JWT is expired (edge-safe, no signature verification)
export function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') return true;
  return Date.now() / 1000 > payload.exp;
}
