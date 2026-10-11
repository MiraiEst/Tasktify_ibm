import jwt from 'jsonwebtoken';
import { Profile } from '@/types';

const SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = 'tasktify_token';
const EXPIRES_IN = '7d';

export interface JwtPayload {
  _id: string;
  email: string;
  full_name: string;
  username: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function cookieName(): string {
  return COOKIE_NAME;
}

export function cookieOptions(expires: Date) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    expires,
  };
}

export function profileToPayload(profile: Profile): JwtPayload {
  return {
    _id: profile._id,
    email: profile.email,
    full_name: profile.full_name,
    username: profile.username,
  };
}
