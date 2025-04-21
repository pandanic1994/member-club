'use client';

import type { FC } from 'react';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

import { ActionTooltip } from '../action-tooltip';

interface NavigationItemProps {
    id: string;
    name: string;
    imageUrl: string;
}

export const NavigationItem: FC<NavigationItemProps> = ({ id, name, imageUrl }) => {
    const params = useParams();
    const route = useRouter();

    const onClick = () => {
        route.push(`/servers/${id}`);
    };

    return (
        <ActionTooltip side="right" align="center" label={name}>
            <button
                type="button"
                onClick={onClick}
                className="tw-group tw-relative tw-flex tw-items-center "
            >
                <div
                    className={cn(
                        'tw-absolute tw-left-0 tw-bg-primary tw-rounded-full tw-transition-all tw-w-[4px]',
                        params?.serverId !== id && 'group-hover:tw-h-[20px]',
                        params?.serverId === id ? 'tw-h-[36px]' : 'tw-h-[8px]',
                    )}
                />
                <div
                    className={cn(
                        'tw-relative tw-group tw-flex tw-mx-3 tw-h-[48px] tw-w-[48px] tw-rounded-[24px]',
                        'group-hover:tw-rounded-[16px] tw-transition-all tw-overflow-hidden',
                        params?.serverId === id && 'tw-bg-primary/10 tw-text-primary',
                        'tw-rounded-[16px]',
                    )}
                >
                    <Image fill src={imageUrl} alt="channel" />
                </div>
            </button>
        </ActionTooltip>
    );
};
