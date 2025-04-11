import type { FC } from 'react';

import { ChatHeader } from '@/components/chat/chat-header';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatMessage } from '@/components/chat/chat-message';
import { getOrCreateConversation } from '@/lib/conversation';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { RedirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

interface MemberIdPageProps {
    params: { memberId: string; serverId: string };
}

const MemberIdPage: FC<MemberIdPageProps> = async ({ params }) => {
    const profile = await currentProfile();
    if (!profile) {
        return RedirectToSignIn({});
    }
    const { memberId, serverId } = await params;
    const currentMember = await db.member.findFirst({
        where: { serverId, profileId: profile.id },
        include: { profile: true },
    });
    if (!currentMember) {
        return redirect(`/`);
    }

    const conversation = await getOrCreateConversation(currentMember.id, memberId);
    if (!conversation) {
        return redirect(`/servers/${serverId}`);
    }

    const { memberOne, memberTwo } = conversation;
    const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

    return (
        <div className="tw-flex tw-h-full tw-flex-col tw-bg-white dark:tw-bg-[#313338]">
            <ChatHeader
                imgUrl={otherMember.profile.imageUrl}
                serverId={serverId}
                name={otherMember.profile.name}
                type="conversation"
            />
            <ChatMessage
                member={currentMember}
                name={otherMember.profile.name}
                chatId={conversation.id}
                type="conversation"
                apiUrl="/api/direct-messages"
                paramKey="conversionId"
                paramValue={conversation.id}
                socketUrl="/api/socket/direct-messages"
                socketQuery={{
                    conversionId: conversation.id,
                    profileId: profile.id,
                }}
            />
            <ChatInput
                name={otherMember.profile.name}
                type="conversation"
                apiUrl="/api/socket/direct-messages"
                query={{ conversionId: conversation.id }}
            />
        </div>
    );
};

export default MemberIdPage;
