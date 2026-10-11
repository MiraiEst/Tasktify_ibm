import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { cookieName, verifyToken } from '@/lib/auth';

export async function GET(_req: NextRequest) {
  const jar = await cookies();
  const token = jar.get(cookieName())?.value;
  if (!token) return NextResponse.json({ user: null });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ user: null });
  return NextResponse.json({ user: payload });
}
