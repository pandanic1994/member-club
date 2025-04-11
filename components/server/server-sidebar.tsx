import type { FC } from 'react';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { ChannelType, MemberRole } from '@prisma/client';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';
import { redirect } from 'next/navigation';

import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { ServerHeader } from './server-header';
import { ServerSearch } from './server-search';
import { ServerSection } from './server-section';
import { ServerChannel } from './server-channel';
import { ServerMember } from './server-member';

interface ServerSidebarProps {
    serverId: string;
}

const iconMap = {
    [ChannelType.TEXT]: <Hash className="tw-mr-2 tw-h-4 tw-w-4" />,
    [ChannelType.AUDIO]: <Mic className="tw-mr-2 tw-h-4 tw-w-4" />,
    [ChannelType.VIDEO]: <Video className="tw-mr-2 tw-h-4 tw-w-4" />,
};

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="tw-ml-2 tw-h-4 tw-w-4 tw-text-indigo-500" />,
    [MemberRole.ADMIN]: <ShieldAlert className="tw-ml-2 tw-h-4 tw-w-4 tw-text-rose-500" />,
};

export const ServerSidebar: FC<ServerSidebarProps> = async ({ serverId }) => {
    const profile = await currentProfile();
    if (!profile) {
        return redirect('/');
    }

    const server = await db.server.findUnique({
        where: { id: serverId },
        include: {
            channel: {
                orderBy: { createdAt: 'asc' },
            },
            member: {
                include: { profile: true },
                orderBy: { role: 'asc' },
            },
        },
    });
    if (!server) {
        return redirect('/');
    }

    const textChannels = server?.channel.filter((channel) => channel.type === ChannelType.TEXT);
    const audioChannels = server?.channel.filter((channel) => channel.type === ChannelType.AUDIO);
    const videoChannels = server?.channel.filter((channel) => channel.type === ChannelType.VIDEO);
    const members = server?.member.filter((member) => member.profileId !== profile.id);

    const role = server?.member.find((member) => member.profileId === profile.id)?.role;

    return (
        <div className="tw-flex tw-h-full tw-w-full tw-flex-col tw-bg-[#F2F3F5] tw-text-primary dark:tw-bg-[#2B2D31]">
            <ServerHeader server={server} role={role} />
            <ScrollArea className="tw-flex-1 tw-px-3">
                <div className="tw-mt-2">
                    <ServerSearch
                        data={[
                            {
                                label: 'Text Channels',
                                type: 'channel',
                                data: textChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                })),
                            },
                            {
                                label: 'Voice Channels',
                                type: 'channel',
                                data: audioChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                })),
                            },
                            {
                                label: 'video Channels',
                                type: 'channel',
                                data: videoChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                })),
                            },

                            {
                                label: 'Member',
                                type: 'member',
                                data: members?.map((member) => ({
                                    id: member.id,
                                    name: member.profile.name,
                                    icon: roleIconMap[member.role],
                                })),
                            },
                        ]}
                    />
                </div>
                <Separator className="tw-my-2 tw-rounded-md tw-bg-zinc-200 dark:tw-bg-zinc-700" />
                {!!textChannels?.length && (
                    <div className="tw-mb-2">
                        <ServerSection
                            sectionType="channel"
                            channelType={ChannelType.TEXT}
                            role={role}
                            label="文字频道"
                        />
                        <div className="tw-space-y-[2px]">
                            {textChannels.map((channel) => (
                                <ServerChannel
                                    key={channel.id}
                                    channel={channel}
                                    server={server}
                                    role={role}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {!!audioChannels?.length && (
                    <div className="tw-mb-2">
                        <ServerSection
                            sectionType="channel"
                            channelType={ChannelType.AUDIO}
                            role={role}
                            label="语音频道"
                        />
                        <div className="tw-space-y-[2px]">
                            {audioChannels.map((channel) => (
                                <ServerChannel
                                    key={channel.id}
                                    channel={channel}
                                    server={server}
                                    role={role}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {!!videoChannels?.length && (
                    <div className="tw-mb-2">
                        <ServerSection
                            sectionType="channel"
                            channelType={ChannelType.VIDEO}
                            role={role}
                            label="视频频道"
                        />
                        <div className="tw-space-y-[2px]">
                            {videoChannels.map((channel) => (
                                <ServerChannel
                                    key={channel.id}
                                    channel={channel}
                                    server={server}
                                    role={role}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {!!members?.length && (
                    <div className="tw-mb-2">
                        <ServerSection
                            sectionType="members"
                            role={role}
                            label="成员"
                            server={server}
                        />
                        <div className="tw-space-y-[2px]">
                            {members.map((member) => (
                                <ServerMember key={member.id} server={server} member={member} />
                            ))}
                        </div>
                    </div>
                )}
            </ScrollArea>
        </div>
    );
};
