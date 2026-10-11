import { NextResponse } from 'next/server';
import { cookieName } from '@/lib/auth';

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(cookieName(), '', { maxAge: 0, path: '/' });
  return res;
}
