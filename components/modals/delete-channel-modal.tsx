'use client';
import { useModal } from '@/hooks/use-modal-store';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import qs from 'query-string';
import { useState } from 'react';

import { Button } from '../ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';

export const DeleteChannelModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const [isLoading, setLoading] = useState(false);
    const isModalOpen = isOpen && type === 'deleteChannel';
    const { server, channel } = data;
    const router = useRouter();
    const onClick = async () => {
        try {
            setLoading(true);

            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: { serverId: server?.id },
            });

            await axios.delete(url);
            onClose();

            router.refresh();
            router.prefetch(`/servers/${server?.id}`);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent
                className="tw-overflow-hidden
             tw-bg-white tw-p-0 tw-text-black"
            >
                <DialogHeader className="tw-px-6 tw-pt-8">
                    <DialogTitle className="tw-text-center tw-text-2xl">删除频道</DialogTitle>
                    <DialogDescription className="tw-text-center tw-text-zinc-500">
                        你确定要删除频道
                        <span className="tw-font-semibold tw-text-indigo-500">
                            #{channel?.name}
                        </span>
                        ? 删除后无法复原
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="tw-bg-gray-100 tw-p-6 tw-py-4">
                    <div className="tw-flex tw-w-full tw-items-center tw-justify-between">
                        <Button
                            onClick={() => {
                                onClose();
                            }}
                            variant="ghost"
                            disabled={isLoading}
                        >
                            取消
                        </Button>
                        <Button
                            onClick={() => {
                                onClick();
                            }}
                            variant="primary"
                            disabled={isLoading}
                        >
                            确认
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
