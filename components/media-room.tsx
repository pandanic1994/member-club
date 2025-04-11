'use client';

import { useUser } from '@clerk/nextjs';
import '@livekit/components-styles';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
interface MediaRoomProps {
    chatId: string;
    video: boolean;
    audio: boolean;
}

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
    const { user } = useUser();
    const [token, setToken] = useState<string | null>(null);
    useEffect(() => {
        if (!user?.firstName || !user?.lastName) return;
        const name = `${user.firstName} ${user.lastName}`;
        (async () => {
            try {
                const res = await fetch(`/api/livekit?room=${chatId}&username=${name}`, {});
                const data = await res.json();
                setToken(data.token);
            } catch (err) {
                console.log(err);
            }
        })();
    }, [user?.firstName, user?.lastName, chatId]);

    if (!token) {
        return (
            <div className="tw-flex tw-flex-col tw-flex-1 tw-justify-center tw-items-center">
                <Loader2 className="tw-h-7 tw-w-7 tw-text-zinc-500 tw-animate-spin tw-my-4"></Loader2>
                <p className="tw-text-zinc-500 tw-text-xs dark:tw-text-zinc-400">加载中......</p>
            </div>
        );
    }

    return (
        <LiveKitRoom
            data-lk-theme="default"
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            token={token}
            connect={true}
            video={video}
            audio={audio}
        >
            <VideoConference />
        </LiveKitRoom>
    );
};
