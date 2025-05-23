import type { Message, Profile } from '@prisma/client';

import { useSocket } from '@/components/providers/socket-provider';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

interface ChatSocketProps {
    addKey: string;
    updateKey: string;
    queryKey: string;
}

type MessageWithMemberWithProfile = Message & {
    member: {
        profile: Profile;
    };
};

export const useChatSocket = ({ addKey, updateKey, queryKey }: ChatSocketProps) => {
    const { socket } = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket) {
            return;
        }
        socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
            queryClient.setQueryData([queryKey], (oldData: any) => {
                if (!oldData || !oldData?.pages || oldData.pages.length === 0) {
                    return oldData;
                }

                const newData = oldData.pages.map((page: any) => {
                    return {
                        ...page,
                        items: page.items.map((m: MessageWithMemberWithProfile) => {
                            if (m.id === message.id) {
                                console.log(`Message updated: ${message.id}:::${message.content}`);
                                return message;
                            }
                            return m;
                        }),
                    };
                });
                return {
                    ...oldData,
                    pages: newData,
                };
            });
        });
        socket.on(addKey, (message: MessageWithMemberWithProfile) => {
            queryClient.setQueryData([queryKey], (oldData: any) => {
                if (!oldData || !oldData?.pages || oldData.pages.length === 0) {
                    return {
                        pages: [
                            {
                                items: [message],
                            },
                        ],
                    };
                }
                const newData = [...oldData.pages];
                newData[0] = {
                    ...newData[0],
                    items: [message, ...newData[0].items],
                };
                return {
                    ...oldData,
                    pages: newData,
                };
            });
        });
        return () => {
            socket.off(updateKey);
            socket.off(addKey);
        };
    }, [queryClient, addKey, socket, updateKey, queryKey]);
};
