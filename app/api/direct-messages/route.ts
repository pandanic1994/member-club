import type { DirectMessage } from '@prisma/client';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

const MESSAGE_BATCH = 10;
export async function GET(req: Request) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const cursor = searchParams.get('cursor');
        const conversionId = searchParams.get('conversionId');

        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!conversionId) {
            return new NextResponse('conversionId ID missing', { status: 400 });
        }

        let messages: DirectMessage[] = [];
        if (cursor) {
            messages = await db.directMessage.findMany({
                take: MESSAGE_BATCH,
                skip: 1, // Skip the cursor message itself
                cursor: { id: cursor },
                where: { conversationId: conversionId },
                include: { member: { include: { profile: true } } },
                orderBy: { createdAt: 'desc' },
            });
        } else {
            messages = await db.directMessage.findMany({
                take: MESSAGE_BATCH,
                where: { conversationId: conversionId },
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
        console.log('[DIRECT_MESSAGE_GET]', err);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
