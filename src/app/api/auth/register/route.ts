import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { collections } from '@/lib/astra';
import { signToken, cookieName, cookieOptions, profileToPayload } from '@/lib/auth';
import { Profile } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { full_name, username, email, phone, address, password } = await req.json();

    if (!full_name || !username || !email || !password) {
      return NextResponse.json({ error: 'full_name, username, email, dan password wajib diisi.' }, { status: 400 });
    }

    const col = collections.profiles();

    // Check email & username uniqueness
    const existing = await col.findOne({ $or: [{ email }, { username }] } as Record<string, unknown>);
    if (existing) {
      const field = (existing as Profile).email === email ? 'Email' : 'Username';
      return NextResponse.json({ error: `${field} sudah digunakan.` }, { status: 409 });
    }

    const now = new Date().toISOString();
    const hashed = await bcrypt.hash(password, 10);

    const profile: Profile & { password_hash: string } = {
      _id: uuidv4(),
      full_name,
      username,
      email,
      phone: phone ?? '',
      address: address ?? '',
      avatar_url: '',
      created_at: now,
      updated_at: now,
      password_hash: hashed,
    };

    await col.insertOne(profile as unknown as Record<string, unknown>);

    // Issue JWT — exclude password_hash
    const token = signToken(profileToPayload(profile));
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const res = NextResponse.json(
      { user: { _id: profile._id, full_name, username, email } },
      { status: 201 },
    );
    res.cookies.set(cookieName(), token, cookieOptions(expires));
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
