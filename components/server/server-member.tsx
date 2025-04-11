/* eslint-disable react-dom/no-missing-button-type */
'use client';

import type { Member, Profile, Server } from '@prisma/client';
import type { FC } from 'react';

import { cn } from '@/lib/utils';
import { MemberRole } from '@prisma/client';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { UserAvatar } from '../user-avatar';

interface ServerMemberProps {
    member: Member & { profile: Profile };
    server: Server;
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="tw-ml-2 tw-h-4 tw-w-4 tw-text-indigo-500" />,
    [MemberRole.ADMIN]: <ShieldAlert className="tw-ml-2 tw-h-4 tw-w-4 tw-text-rose-500" />,
};

export const ServerMember: FC<ServerMemberProps> = ({ member, server }) => {
    const params = useParams();
    const router = useRouter();

    const icon = roleIconMap[member.role];

    const onClick = () => {
        router.push(`/servers/${server.id}/conversation/${member.id}`);
    };
    return (
        <button
            onClick={onClick}
            className={cn(
                'tw-group tw-p-2 tw-rounded-md tw-flex tw-items-center',
                'tw-gap-x-2 tw-w-full hover:tw-bg-zinc-700/10 dark:hover:tw-bg-zinc-700/50',
                'tw-transition tw-mb-1',
                params?.memberId === member.id && 'tw-bg-zinc-700/20 dark:bg-zinc-700',
            )}
        >
            <UserAvatar
                src={member.profile.imageUrl}
                className="tw-h-8 tw-w-8 md:tw-h-8 md:tw-w-8"
            />
            <p
                className={cn(
                    'tw-font-semibold tw-text-sm tw-text-zinc-500',
                    'group-hover:tw-text-zinc-600 dark:tw-text-zinc-400 ',
                    'dark:group-hover:tw-text-zinc-300 tw-transition',
                    params?.memberId === member.id &&
                        'tw-text-primary dark:tw-text-zinc-200 dark:group-hover:tw-text-white',
                )}
            >
                {member.profile.name}
            </p>
            {icon}
        </button>
    );
};
