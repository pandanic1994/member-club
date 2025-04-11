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
        const { messageId, serverId, channelId } = req.query;
        const { content } = req.body;

        if (!profile) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (!serverId) {
            return res.status(400).json({ error: 'Server ID missing' });
        }
        if (!channelId) {
            return res.status(400).json({ error: 'Channel ID missing' });
        }
        const server = await db.server.findFirst({
            where: {
                id: serverId as string,
                member: {
                    some: {
                        profileId: profile.id,
                    },
                },
            },
            include: {
                member: true,
            },
        });
        if (!server) {
            return res.status(404).json({ error: 'Server not found' });
        }

        const channel = await db.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: serverId as string,
            },
        });
        if (!channel) {
            return res.status(404).json({ error: 'Channel not found' });
        }

        const member = server.member.find((member) => member.profileId === profile.id);

        if (!member) {
            return res.status(404).json({ error: 'Member not found' });
        }

        let message = await db.message.findFirst({
            where: {
                id: messageId as string,
                channelId: channelId as string,
            },
            include: { member: { include: { profile: true } } },
        });

        if (!message || message.deleted) {
            return res.status(404).json({ error: 'Message not found' });
        }
        const isMessageOwner = message.memberId === member.id; // Check if the message is owned by the current user
        const isAdmin = member.role === MemberRole.ADMIN; // Check if the user is an admin
        const isModerator = member.role === MemberRole.MODERATOR; // Check if the user is a moderator
        const canModify = isMessageOwner || isAdmin || isModerator; // Check if the user can modify the message
        if (!canModify) {
            return res.status(401).json({ error: 'Unauthorized' }); // User does not have permission to modify the message
        }

        if (req.method === 'DELETE') {
            message = await db.message.update({
                where: { id: messageId as string },
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
            message = await db.message.update({
                where: { id: messageId as string },
                data: { content },
                include: { member: { include: { profile: true } } },
            });
        }
        const updateKey = `chat:${channelId}:messages:update`; // Update key for the channel's messages
        res?.socket?.server?.io?.emit(updateKey, message); // Emit the update to all connected clients
        return res.status(200).json(message);
    } catch (error) {
        console.log('[MESSAGE_ID]', error);
        return res.status(500).json({ error: 'Internal error' });
    }
}
