'use client';

import { useSocket } from './providers/socket-provider';
import { Badge } from './ui/badge';

export const SocketIndicator = () => {
    const { isConnected } = useSocket();
    if (!isConnected) {
        return (
            <Badge variant="outline" className="tw-bg-yellow-600 tw-text-white tw-border-none">
                Fallback: polling every 1s
            </Badge>
        );
    }
    return (
        <Badge variant="outline" className="tw-bg-emerald-600 tw-text-white tw-border-none">
            Live: polling every 1s
        </Badge>
    );
};
