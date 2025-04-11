'use client';
import { useModal } from '@/hooks/use-modal-store';
import axios from 'axios';
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

export const DeleteMessageModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const [isLoading, setLoading] = useState(false);
    const isModalOpen = isOpen && type === 'deleteMessage';
    const { apiUrl, query } = data;
    const onClick = async () => {
        try {
            setLoading(true);

            const url = qs.stringifyUrl({
                url: apiUrl || '',
                query,
            });

            await axios.delete(url);
            onClose();
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
                        你确定要删除消息? 删除后无法复原
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
