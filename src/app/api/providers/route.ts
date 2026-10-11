import { NextRequest, NextResponse } from 'next/server';
import { collections } from '@/lib/astra';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const location = searchParams.get('location');

    const filter: Record<string, string> = {};
    if (category) filter.category = category;
    if (location) filter.location = location;

    const col = collections.providers();
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
      rating: body.rating ?? 0,
      jobs: body.jobs ?? 0,
      verified: body.verified ?? false,
      created_at: new Date().toISOString(),
    };

    const col = collections.providers();
    await col.insertOne(doc);

    return NextResponse.json(doc, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
