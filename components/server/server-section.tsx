/* eslint-disable react-dom/no-missing-button-type */
'use client';

import type { ServerWithMembersWithProfiles } from '@/types';
import type { ChannelType } from '@prisma/client';
import type { FC } from 'react';

import { useModal } from '@/hooks/use-modal-store';
import { MemberRole } from '@prisma/client';
import { Plus, Settings } from 'lucide-react';

import { ActionTooltip } from '../action-tooltip';

interface ServerSectionProps {
    label: string;
    role?: MemberRole;
    sectionType: 'channel' | 'members';
    channelType?: ChannelType;
    server?: ServerWithMembersWithProfiles;
}

export const ServerSection: FC<ServerSectionProps> = ({
    label,
    role,
    sectionType,
    channelType,
    server,
}) => {
    const { onOpen } = useModal();

    return (
        <div
            className="tw-flex tw-items-center tw-justify-between
    tw-py-2"
        >
            <p
                className="tw-text-xs tw-font-semibold tw-uppercase tw-text-zinc-500 
            dark:tw-text-zinc-400"
            >
                {label}
            </p>
            {role !== MemberRole.GUEST && sectionType === 'channel' && (
                <ActionTooltip label="创建频道" side="top">
                    <button
                        onClick={() => onOpen('createChannel', { channelType })}
                        className="tw-zinc-500 tw-transition hover:tw-text-zinc-600 dark:tw-text-zinc-400 dark:hover:tw-text-zinc-400"
                    >
                        <Plus className="tw-h-4 tw-w-4" />
                    </button>
                </ActionTooltip>
            )}

            {role === MemberRole.ADMIN && sectionType === 'members' && (
                <ActionTooltip label="成员管理" side="top">
                    <button
                        onClick={() => onOpen('members', { server })}
                        className="tw-zinc-500 tw-transition hover:tw-text-zinc-600 dark:tw-text-zinc-400 dark:hover:tw-text-zinc-400"
                    >
                        <Settings className="tw-h-4 tw-w-4" />
                    </button>
                </ActionTooltip>
            )}
        </div>
    );
};
