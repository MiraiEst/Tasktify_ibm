import { NextRequest, NextResponse } from 'next/server';
import { collections } from '@/lib/astra';
import { cookies } from 'next/headers';
import { cookieName, verifyToken } from '@/lib/auth';

type Params = { params: Promise<{ id: string }> };

// Provider takes/accepts a task
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    // Verify auth
    const jar = await cookies();
    const token = jar.get(cookieName())?.value;
    const user = token ? verifyToken(token) : null;
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const col = collections.tasks();
    const task = await col.findOne({ _id: id });
    if (!task) return NextResponse.json({ error: 'Task tidak ditemukan' }, { status: 404 });
    if (task.status !== 'waiting') {
      return NextResponse.json({ error: 'Task ini sudah tidak tersedia' }, { status: 409 });
    }
    if (task.user_id === user._id) {
      return NextResponse.json({ error: 'Anda tidak bisa mengambil task milik sendiri' }, { status: 400 });
    }

    const now = new Date().toISOString();
    await col.updateOne(
      { _id: id },
      { $set: { provider_id: user._id, status: 'scheduled', updated_at: now } },
    );

    // Notify the task owner
    await collections.notifications().insertOne({
      _id: `NTF-${Date.now()}`,
      user_id: task.user_id as string,
      title: 'Task Diambil!',
      body: `Task "${task.title}" telah diambil oleh ${user.full_name}.`,
      read: false,
      created_at: now,
    });

    const updated = await col.findOne({ _id: id });
    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
