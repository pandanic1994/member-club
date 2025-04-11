/* eslint-disable react-dom/no-missing-button-type */
'use client';

import type { ModalType } from '@/hooks/use-modal-store';
import type { Channel, Server } from '@prisma/client';
import type { FC } from 'react';

import { useModal } from '@/hooks/use-modal-store';
import { cn } from '@/lib/utils';
import { ChannelType, MemberRole } from '@prisma/client';
import { cloneDeep } from 'lodash';
import { Edit, Hash, Lock, Mic, Trash, Video } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { ActionTooltip } from '../action-tooltip';

interface ServerChannelProps {
    channel: Channel;
    server: Server;
    role?: MemberRole;
}

const iconMap = {
    [ChannelType.TEXT]: Hash,
    [ChannelType.AUDIO]: Mic,
    [ChannelType.VIDEO]: Video,
};

export const ServerChannel: FC<ServerChannelProps> = ({ channel, server, role }) => {
    const params = useParams();
    const router = useRouter();
    const { onOpen } = useModal();

    const Icon = iconMap[channel.type];

    const onClick = () => {
        router.push(`/servers/${server.id}/channels/${channel.id}`);
    };

    const onAction = (e: React.MouseEvent, action: ModalType) => {
        e.stopPropagation();
        onOpen(action, { server, channel: cloneDeep(channel) });
    };

    return (
        <button
            onClick={onClick}
            className={cn(
                'tw-group tw-px-2 tw-py-2 tw-rounded-md tw-flex tw-items-center tw-gap-x-2 tw-w-full',
                'hover:tw-bg-zinc-700/10 dark:hover:tw-bg-zinc-700/50 tw-transition tw-mb-1',

                params?.channelId === channel.id && 'tw-bg-zinc-700/20 dark:tw-bg-zinc-700',
            )}
        >
            <Icon className="tw-h-5 tw-w-5 tw-shrink-0 tw-text-zinc-500 dark:tw-text-zinc-400" />
            <p
                className={cn(
                    'tw-line-clamp-1 tw-text-sm tw-text-zinc-500',
                    'group-hover:tw-text-zinc-600 dark:tw-text-zinc-400 dark:group-hover:tw-text-zinc-300 tw-transition',
                    params?.channelId === channel.id &&
                        'tw-text-primary dark:tw-text-zinc-200 dark:group-hover:tw-text-white',
                )}
            >
                {channel.name}
            </p>
            {channel.name !== 'general' && role !== MemberRole.GUEST && (
                <div className="tw-item-center tw-ml-auto tw-flex  tw-gap-x-2">
                    <ActionTooltip label="修改">
                        <Edit
                            onClick={(e) => onAction(e, 'editChannel')}
                            className="tw-hidden tw-h-4 tw-w-4 tw-text-zinc-500 tw-transition hover:tw-text-zinc-600 group-hover:tw-block dark:tw-text-zinc-400 dark:hover:tw-text-zinc-300"
                        />
                    </ActionTooltip>
                    <ActionTooltip label="删除">
                        <Trash
                            onClick={(e) => onAction(e, 'deleteChannel')}
                            className="tw-hidden tw-h-4 tw-w-4 tw-text-zinc-500 tw-transition hover:tw-text-zinc-600 group-hover:tw-block dark:tw-text-zinc-400 dark:hover:tw-text-zinc-300"
                        />
                    </ActionTooltip>
                </div>
            )}
            {channel.name === 'general' && (
                <Lock className="tw-ml-auto tw-h-4 tw-w-4 tw-text-zinc-500 dark:tw-text-zinc-400" />
            )}
        </button>
    );
};
