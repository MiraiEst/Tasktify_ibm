import { NextRequest, NextResponse } from 'next/server';
import { collections } from '@/lib/astra';

// Public task board — returns all 'waiting' tasks visible to any logged-in user
// Supports optional filters: ?category=xxx&location=xxx&search=xxx
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const location = searchParams.get('location');

    const filter: Record<string, unknown> = { status: 'waiting' };
    if (category && category !== 'Semua') filter.category = category;
    if (location) filter.location = location;

    const col = collections.tasks();
    const docs = await col.find(filter).toArray();

    return NextResponse.json(docs);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
