import { NextRequest, NextResponse } from 'next/server';
import { collections } from '@/lib/astra';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get('user_id');

    const filter = user_id ? { user_id } : {};
    const col = collections.profiles();
    const cursor = col.find(filter);
    const docs = await cursor.toArray();

    return NextResponse.json(docs);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const now = new Date().toISOString();
    const doc = {
      _id: uuidv4(),
      ...body,
      created_at: now,
      updated_at: now,
    };

    const col = collections.profiles();
    await col.insertOne(doc);

    return NextResponse.json(doc, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
