import type { FC } from 'react';

import { Hash } from 'lucide-react';

import { MobileToggle } from '../mobile-toggle';
import { SocketIndicator } from '../socket-indicator';
import { UserAvatar } from '../user-avatar';

interface ChatHeaderProps {
    serverId: string;
    name: string;
    type: 'channel' | 'conversation';
    imgUrl?: string;
}

export const ChatHeader: FC<ChatHeaderProps> = ({ serverId, name, type, imgUrl }) => {
    return (
        <div className="tw-flex tw-h-12 tw-items-center tw-border-b-2 tw-border-neutral-200 tw-px-3 tw-text-base tw-font-semibold dark:tw-border-neutral-800">
            <MobileToggle serverId={serverId} />
            {type === 'channel' && (
                <Hash className="tw-h-5 tw-w-5 tw-text-zinc-500 dark:tw-text-zinc-400" />
            )}
            {type === 'conversation' && (
                <UserAvatar src={imgUrl} className="tw-mr-3 tw-h-8 tw-w-8 md:tw-h-8 md:tw-w-8" />
            )}

            <p className="tw-text-base tw-font-semibold tw-text-black dark:tw-text-white">{name}</p>

            <div className="tw-ml-auto tw-flex tw-items-center">
                <SocketIndicator />
            </div>
        </div>
    );
};
