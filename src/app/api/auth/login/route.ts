import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { collections } from '@/lib/astra';
import { signToken, cookieName, cookieOptions, profileToPayload } from '@/lib/auth';
import { Profile } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password wajib diisi.' }, { status: 400 });
    }

    const col = collections.profiles();
    const profile = await col.findOne({ email }) as (Profile & { password_hash: string }) | null;

    if (!profile) {
      return NextResponse.json({ error: 'Email atau password salah.' }, { status: 401 });
    }

    const match = await bcrypt.compare(password, profile.password_hash ?? '');
    if (!match) {
      return NextResponse.json({ error: 'Email atau password salah.' }, { status: 401 });
    }

    const token = signToken(profileToPayload(profile));
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const res = NextResponse.json({
      user: {
        _id: profile._id,
        full_name: profile.full_name,
        username: profile.username,
        email: profile.email,
      },
    });
    res.cookies.set(cookieName(), token, cookieOptions(expires));
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
