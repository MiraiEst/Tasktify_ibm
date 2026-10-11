import { NextRequest, NextResponse } from 'next/server';
import { collections } from '@/lib/astra';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const task_id = searchParams.get('task_id');

    const filter = task_id ? { task_id } : {};
    const col = collections.payments();
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
    const orderId = `ORDER-${Date.now()}`;

    // Snap token placeholder — full Midtrans integration not required yet
    const snapToken = `snap-token-placeholder-${uuidv4()}`;

    const doc = {
      _id: uuidv4(),
      ...body,
      midtrans_order_id: orderId,
      snap_token: snapToken,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    const col = collections.payments();
    await col.insertOne(doc);

    return NextResponse.json(doc, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
