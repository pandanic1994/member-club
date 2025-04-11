import type { FC } from 'react';

import { ChatHeader } from '@/components/chat/chat-header';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatMessage } from '@/components/chat/chat-message';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { RedirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { ChannelType } from '@prisma/client';
import { MediaRoom } from '@/components/media-room';

interface ChannelIdPageProps {
    params: { channelId: string; serverId: string };
}

const ChannelIdPage: FC<ChannelIdPageProps> = async ({ params }) => {
    const { channelId, serverId } = await params;
    const profile = await currentProfile();
    if (!profile) {
        return RedirectToSignIn({});
    }
    const channel = await db.channel.findUnique({
        where: { id: channelId },
    });
    const member = await db.member.findFirst({
        where: { profileId: profile.id, serverId },
    });

    if (!member || !channel) {
        return redirect(`/`);
    }

    return (
        <div
            className="tw-flex
    tw-h-full tw-flex-col tw-bg-white dark:tw-bg-[#313338]"
        >
            <ChatHeader name={channel.name} serverId={channel.serverId} type="channel" />
            {channel.type === ChannelType.TEXT && (
                <>
                    <ChatMessage
                        member={member}
                        chatId={channel.id}
                        name={channel.name}
                        type="channel"
                        apiUrl="/api/messages"
                        socketUrl="/api/socket/messages"
                        socketQuery={{ channelId: channel.id, serverId: channel.serverId }}
                        paramKey="channelId"
                        paramValue={channel.id}
                    />
                    <ChatInput
                        name={channel.name}
                        type="channel"
                        apiUrl="/api/socket/messages"
                        query={{ channelId: channel.id, serverId: channel.serverId }}
                    />
                </>
            )}
            {channel.type === ChannelType.AUDIO && (
                <MediaRoom chatId={channel.id} video={false} audio={true} />
            )}
            {channel.type === ChannelType.VIDEO && (
                <MediaRoom chatId={channel.id} video={true} audio={false} />
            )}
        </div>
    );
};

export default ChannelIdPage;
