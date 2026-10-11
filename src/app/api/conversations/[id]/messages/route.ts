import { NextRequest, NextResponse } from 'next/server';
import { collections } from '@/lib/astra';
import { v4 as uuidv4 } from 'uuid';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const col = collections.messages();
    const cursor = col.find({ conversation_id: id });
    const docs = await cursor.toArray();
    return NextResponse.json(docs);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await req.json();
    const now = new Date().toISOString();

    const msgDoc = {
      _id: uuidv4(),
      conversation_id: id,
      ...body,
      created_at: now,
    };

    await collections.messages().insertOne(msgDoc);

    // Update conversation's last_message and last_message_at
    await collections.conversations().updateOne(
      { _id: id },
      {
        $set: {
          last_message: body.text,
          last_message_at: now,
          updated_at: now,
        },
      },
    );

    return NextResponse.json(msgDoc, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
