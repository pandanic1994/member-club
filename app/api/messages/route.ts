import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { Message } from '@prisma/client';
import { NextResponse } from 'next/server';

const MESSAGE_BATCH = 10;
export async function GET(req: Request) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const cursor = searchParams.get('cursor');
        const channelId = searchParams.get('channelId');

        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!channelId) {
            return new NextResponse('Channel ID missing', { status: 400 });
        }

        let messages: Message[] = [];
        if (cursor) {
            messages = await db.message.findMany({
                take: MESSAGE_BATCH,
                skip: 1, // Skip the cursor message itself
                cursor: { id: cursor },
                where: { channelId },
                include: { member: { include: { profile: true } } },
                orderBy: { createdAt: 'desc' },
            });
        } else {
            messages = await db.message.findMany({
                take: MESSAGE_BATCH,
                where: { channelId },
                include: { member: { include: { profile: true } } },
                orderBy: { createdAt: 'desc' },
            });
        }
        let nextCursor = null;
        if (messages.length === MESSAGE_BATCH) {
            const lastMessage = messages[MESSAGE_BATCH - 1];
            nextCursor = lastMessage.id; // Use the ID of the last message as the cursor for the next batch
        }
        return NextResponse.json({ items: messages, nextCursor });
    } catch (err) {
        console.log('[MESSAGE_GET]', err);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
