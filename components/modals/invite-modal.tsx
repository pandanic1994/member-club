'use client';

import { useModal } from '@/hooks/use-modal-store';
import { useOrigin } from '@/hooks/use-origin';
import axios from 'axios';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { useState } from 'react';

import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export const InviteModal = () => {
    const { onOpen, isOpen, onClose, type, data } = useModal();
    const origin = useOrigin();

    const isModalOpen = isOpen && type === 'invite';
    const { server } = data;

    const [copied, setCopied] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const onNew = async () => {
        try {
            setLoading(true);
            const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);
            onOpen('invite', { server: response.data });
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
                    <DialogTitle className="tw-text-center tw-text-2xl">邀请成员</DialogTitle>
                    <DialogDescription className="tw-text-center tw-text-zinc-500">
                        邀请成员加入你的服务器
                    </DialogDescription>
                </DialogHeader>
                <div className="tw-p-6">
                    <Label className="tw-text-xs tw-font-bold tw-uppercase tw-text-zinc-500 dark:tw-text-secondary/70">
                        服务邀请链接
                    </Label>
                    <div className="tw-mt-2 tw-flex tw-items-center tw-gap-x-2">
                        <Input
                            readOnly
                            disabled={isLoading}
                            className="tw-border-0 tw-bg-zinc-300/50 tw-text-black focus-visible:tw-ring-0 
                        focus-visible:tw-ring-offset-0"
                            value={inviteUrl}
                        />
                        <Button disabled={isLoading} onClick={onCopy} size="icon">
                            {copied ? (
                                <Check className="tw-h-4 tw-w-4" />
                            ) : (
                                <Copy className="tw-h-4 tw-w-4" />
                            )}
                        </Button>
                    </div>
                    <Button
                        onClick={onNew}
                        disabled={isLoading}
                        variant="link"
                        size="sm"
                        className="tw-mt-4 tw-text-xs tw-text-zinc-500"
                    >
                        获取新的链接
                        <RefreshCw className="tw-ml-2 tw-h-4 tw-w-4" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
