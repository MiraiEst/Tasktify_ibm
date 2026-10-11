import { NextRequest, NextResponse } from 'next/server';
import { collections } from '@/lib/astra';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const provider_id = searchParams.get('provider_id');
    const user_id = searchParams.get('user_id');

    const filter: Record<string, string> = {};
    if (provider_id) filter.provider_id = provider_id;
    if (user_id) filter.user_id = user_id;

    const col = collections.ratings();
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

    // 1. Save rating
    const ratingDoc = {
      _id: uuidv4(),
      ...body,
      created_at: now,
    };
    await collections.ratings().insertOne(ratingDoc);

    // 2. Recalculate provider average rating
    const allRatings = await collections
      .ratings()
      .find({ provider_id: body.provider_id })
      .toArray();

    const avgRating =
      allRatings.reduce((sum: number, r) => sum + (r.score as number), 0) /
      allRatings.length;

    // 3. Update provider: new avg rating + increment jobs
    await collections.providers().updateOne(
      { _id: body.provider_id },
      {
        $set: {
          rating: Math.round(avgRating * 10) / 10,
          updated_at: now,
        },
        $inc: { jobs: 1 },
      },
    );

    // 4. Create notification for provider
    const providerDoc = await collections
      .providers()
      .findOne({ _id: body.provider_id });

    if (providerDoc?.user_id) {
      await collections.notifications().insertOne({
        _id: uuidv4(),
        user_id: providerDoc.user_id as string,
        title: 'New Rating Received',
        body: `${body.client_name} gave you a ${body.score}-star rating for "${body.task_title}".`,
        read: false,
        created_at: now,
      });
    }

    return NextResponse.json(ratingDoc, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
