import { NextRequest, NextResponse } from 'next/server';
import { collections } from '@/lib/astra';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get('user_id');
    const provider_id = searchParams.get('provider_id');

    const filter: Record<string, string> = {};
    if (user_id) filter.user_id = user_id;
    if (provider_id) filter.provider_id = provider_id;

    const col = collections.conversations();
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
    const doc = {
      _id: uuidv4(),
      ...body,
      created_at: new Date().toISOString(),
    };

    const col = collections.conversations();
    await col.insertOne(doc);

    return NextResponse.json(doc, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
