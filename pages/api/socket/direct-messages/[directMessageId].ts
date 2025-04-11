import type { NextApiResponseServerIo } from '@/types';
import type { NextApiRequest } from 'next';

import { currentProfilePages } from '@/lib/current-profile-pages';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
    if (req.method !== 'DELETE' && req.method !== 'PATCH') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const profile = await currentProfilePages(req);
        const { conversionId, directMessageId } = req.query;
        const { content } = req.body;

        if (!profile) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (!conversionId) {
            return res.status(400).json({ error: 'conversionId ID missing' });
        }
        if (!directMessageId) {
            return res.status(400).json({ error: 'directMessageId ID missing' });
        }

        const conversation = await db.conversation.findFirst({
            where: {
                id: conversionId as string,
                AND: [
                    {
                        OR: [
                            { memberOne: { profileId: profile.id } },
                            { memberTwo: { profileId: profile.id } },
                        ],
                    },
                ],
            },
            include: {
                memberOne: {
                    include: {
                        profile: true,
                    },
                },
                memberTwo: {
                    include: {
                        profile: true,
                    },
                },
            },
        });
        if (!conversation) {
            return res.status(404).json({ error: 'conversation not found' });
        }

        const member =
            conversation.memberOne.profileId === profile.id
                ? conversation.memberOne
                : conversation.memberTwo;

        if (!member) {
            return res.status(404).json({ error: 'Member not found' });
        }

        let directMessage = await db.directMessage.findFirst({
            where: {
                id: directMessageId as string,
                conversationId: conversionId as string,
            },
            include: { member: { include: { profile: true } } },
        });

        if (!directMessage || directMessage.deleted) {
            return res.status(404).json({ error: 'Message not found' });
        }
        const isMessageOwner = directMessage.memberId === member.id; // Check if the message is owned by the current user
        const isAdmin = member.role === MemberRole.ADMIN; // Check if the user is an admin
        const isModerator = member.role === MemberRole.MODERATOR; // Check if the user is a moderator
        const canModify = isMessageOwner || isAdmin || isModerator; // Check if the user can modify the message
        if (!canModify) {
            return res.status(401).json({ error: 'Unauthorized' }); // User does not have permission to modify the message
        }

        if (req.method === 'DELETE') {
            directMessage = await db.directMessage.update({
                where: { id: directMessageId as string },
                data: { fileUrl: null, content: '这条消息已被删除！', deleted: true },
                include: { member: { include: { profile: true } } },
            });
        }
        if (req.method === 'PATCH') {
            if (!isMessageOwner) {
                return res.status(401).json({ error: 'Unauthorized' }); // User does not have permission to modify the message
            }
            if (!content) {
                return res.status(400).json({ error: 'Content missing' }); // Content is missing in the request body
            }
            directMessage = await db.directMessage.update({
                where: { id: directMessageId as string },
                data: { content },
                include: { member: { include: { profile: true } } },
            });
        }
        const updateKey = `chat:${conversation.id}:messages:update`; // Update key for the channel's messages
        res?.socket?.server?.io?.emit(updateKey, directMessage); // Emit the update to all connected clients
        return res.status(200).json(directMessage);
    } catch (error) {
        console.log('DIRECT_[MESSAGE_ID]', error);
        return res.status(500).json({ error: 'Internal error' });
    }
}
