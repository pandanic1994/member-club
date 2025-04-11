'use client';

import type { Member, Message, Profile } from '@prisma/client';
import type { ComponentRef, FC } from 'react';

import { useChatQuery } from '@/hooks/use-chat-query';
import { useChatScroll } from '@/hooks/use-chat-scroll';
import { useChatSocket } from '@/hooks/use-chat-socket';
import { format } from 'date-fns';
import { Loader2, ServerCrash } from 'lucide-react';
import { Fragment, useRef } from 'react';

import { ChatItem } from './chat-item';
import { ChatWelcome } from './chat-welcome';

const DATE_FORMAT = 'd MMM yyyy, HH:mm';

type MessageWithMemberWithProfile = Message & {
    member: Member & { profile: Profile };
};

interface ChatMessageProps {
    name: string;
    member: Member;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, string>;
    paramKey: 'channelId' | 'conversionId';
    paramValue: string;
    type: 'channel' | 'conversation';
}

export const ChatMessage: FC<ChatMessageProps> = ({
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramValue,
    type,
}) => {
    const queryKey = `chat:${chatId}`;
    const addKey = `chat:${chatId}:messages`;
    const updateKey = `chat:${chatId}:messages:update`;

    const chatRef = useRef<ComponentRef<'div'>>(null);
    const bottomRef = useRef<ComponentRef<'div'>>(null);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({
        queryKey,
        apiUrl,
        paramKey,
        paramValue,
    });

    useChatSocket({ queryKey, addKey, updateKey });
    useChatScroll({
        chatRef,
        bottomRef,
        loadMore: fetchNextPage,
        shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
        count: data?.pages?.[0].items?.length ?? 0,
    });

    if (status === 'pending') {
        return (
            <div className="tw-flex tw-flex-1 tw-flex-col tw-items-center tw-justify-center">
                <Loader2 className="tw-tex-zinc-500 tw-my-4 tw-h-7 tw-w-7 tw-animate-spin" />
                <p className="tw-text-xs tw-text-zinc-500 dark:tw-text-zinc-400">
                    正在读取数据.....
                </p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="tw-flex tw-flex-1 tw-flex-col tw-items-center tw-justify-center">
                <ServerCrash className="tw-tex-zinc-500 tw-my-4 tw-h-7  tw-w-7" />
                <p className="tw-text-xs tw-text-zinc-500 dark:tw-text-zinc-400">
                    似乎有什么东西出错了....
                </p>
            </div>
        );
    }

    return (
        <div
            ref={chatRef}
            className="tw-flex tw-flex-1 tw-flex-col tw-overflow-auto
    tw-py-4"
        >
            {!hasNextPage && <div className="tw-flex-1" />}
            {!hasNextPage && <ChatWelcome type={type} name={name} />}
            {hasNextPage && (
                <div className="tw-flex tw-justify-center">
                    {isFetchingNextPage ? (
                        <Loader2 className="tw-tex-zinc-500 tw-my-4 tw-h-6 tw-w-6 tw-animate-spin" />
                    ) : (
                        <button
                            onClick={() => {
                                fetchNextPage();
                            }}
                            type="button"
                            className="tw-my-4 tw-text-xs
                        tw-text-zinc-500 tw-transition hover:tw-text-zinc-600 dark:tw-text-zinc-400 dark:hover:tw-text-zinc-300"
                        >
                            加载更多
                        </button>
                    )}
                </div>
            )}
            <div className="tw-mt-auto tw-flex tw-flex-col-reverse">
                {data?.pages?.map((group, i) => (
                    <Fragment key={i}>
                        {group.items.map((message: MessageWithMemberWithProfile) => {
                            return (
                                <ChatItem
                                    key={message.id}
                                    currentMember={member}
                                    id={message.id}
                                    content={message.content}
                                    fileUrl={message.fileUrl}
                                    deleted={message.deleted}
                                    timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                                    member={message.member}
                                    isUpdated={message.updatedAt !== message.createdAt}
                                    socketUrl={socketUrl}
                                    socketQuery={socketQuery}
                                />
                            );
                        })}
                    </Fragment>
                ))}
            </div>
            <div ref={bottomRef} />
        </div>
    );
};
