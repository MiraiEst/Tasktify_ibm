import { NextRequest, NextResponse } from 'next/server';
import { collections } from '@/lib/astra';
import { callLangflowModerate } from '@/lib/langflow';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get('user_id');
    const status = searchParams.get('status');
    const provider_id = searchParams.get('provider_id');

    const filter: Record<string, string> = {};
    if (user_id) filter.user_id = user_id;
    if (status) filter.status = status;
    if (provider_id) filter.provider_id = provider_id;

    const col = collections.tasks();
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

    // Generate TSK-xxxx ID using timestamp
    const taskId = `TSK-${Date.now()}`;

    // Call Langflow moderation — REQUIRED. If unavailable, reject the task.
    let moderation: { safe: boolean; reason?: string };
    try {
      moderation = await callLangflowModerate({
        title: body.title,
        note: body.note ?? '',
        category: body.category,
        user_id: body.user_id,
      });
    } catch (moderationErr) {
      const errMsg = moderationErr instanceof Error ? moderationErr.message : String(moderationErr);
      console.error('[Langflow] Moderation failed:', errMsg);
      // If Langflow is unreachable, reject with pending_review status
      moderation = {
        safe: false,
        reason: 'Layanan moderasi sedang tidak tersedia. Task Anda akan ditinjau secara manual.',
      };
    }

    const taskStatus = moderation.safe ? 'waiting' : 'rejected';

    const doc = {
      _id: taskId,
      ...body,
      status: taskStatus,
      created_at: now,
    };

    const tasksCol = collections.tasks();
    await tasksCol.insertOne(doc);

    // If rejected, create a notification for the user
    if (!moderation.safe) {
      const notifDoc = {
        _id: `NTF-${Date.now()}`,
        user_id: body.user_id,
        title: 'Task Rejected',
        body: moderation.reason ?? 'Your task was rejected due to policy violations.',
        read: false,
        created_at: now,
      };
      await collections.notifications().insertOne(notifDoc);
    }

    return NextResponse.json({ task: doc, moderation }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
