/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
'use client';

import type { Member, Profile } from '@prisma/client';
import type { FC } from 'react';

import { useModal } from '@/hooks/use-modal-store';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import qs from 'query-string';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { ActionTooltip } from '../action-tooltip';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { Input } from '../ui/input';
import { UserAvatar } from '../user-avatar';

interface ChatItemProps {
    id: string;
    content: string;
    member: Member & {
        profile: Profile;
    };
    timestamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentMember: Member;
    isUpdated: boolean;
    socketUrl: string;
    socketQuery: Record<string, string>;
}

const roleIconMap = {
    GUEST: null,
    ADMIN: <ShieldAlert className="tw-ml-2 tw-h-4 tw-w-4 tw-text-rose-500" />,
    MODERATOR: <ShieldCheck className="tw-ml-2 tw-h-4 tw-w-4 tw-text-indigo-500" />,
};

const formSchema = z.object({
    content: z.string().min(1, '内容不能为空'),
});

export const ChatItem: FC<ChatItemProps> = ({
    id,
    content,
    member,
    timestamp,
    fileUrl,
    deleted,
    currentMember,
    isUpdated,
    socketUrl,
    socketQuery,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const { onOpen } = useModal();
    const params = useParams();
    const router = useRouter();

    const onMemberClick = () => {
        if (member.id === currentMember.id) {
            return;
        }
        router.push(`/servers/${params?.serverId}/conversation/${member.id}`);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' || e.key === 'Esc') {
                setIsEditing(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content,
        },
    });

    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `${socketUrl}/${id}`,
                query: socketQuery,
            });
            await axios.patch(url, values);
            setIsEditing(false);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        form.setValue('content', content);
    }, [form, content]);

    const fileType = fileUrl?.split('#').pop();

    const isAdmin = currentMember.role === 'ADMIN';
    const isModerator = currentMember.role === 'MODERATOR';
    const isOwner = (currentMember.id = member.id);
    const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
    const canEditMessage = !deleted && isOwner && !fileUrl;
    const isPDF = fileType?.includes('pdf') && fileUrl;
    const isImage = fileType?.includes('image') && fileUrl;

    return (
        <div
            className="tw-group tw-relative tw-flex tw-w-full 
    tw-items-center tw-p-4 tw-transition hover:tw-bg-black/5"
        >
            <div className="tw-group tw-flex tw-w-full tw-items-start tw-gap-2">
                <div
                    onClick={onMemberClick}
                    className="tw-cursor-pointer tw-transition hover:tw-drop-shadow-md"
                >
                    <UserAvatar src={member.profile.imageUrl} />
                </div>
                <div className="tw-flex tw-w-full tw-flex-col">
                    <div className="tw-flex tw-items-center tw-gap-x-2 ">
                        <div className="tw-flex tw-items-center">
                            <p
                                onClick={onMemberClick}
                                className="tw-cursor-pointer tw-text-sm tw-font-semibold hover:tw-underline"
                            >
                                {member.profile.name}
                            </p>
                            <ActionTooltip label={member.role}>
                                {roleIconMap[member.role]}
                            </ActionTooltip>
                        </div>
                        <span className="tw-text-xs tw-text-zinc-500 dark:tw-text-zinc-400 ">
                            {timestamp}
                        </span>
                    </div>
                    {isImage && (
                        <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="tw-relative tw-mt-2 tw-flex tw-aspect-square tw-h-48 tw-w-48 tw-items-center
                            tw-overflow-hidden tw-rounded-md tw-border tw-bg-secondary"
                        >
                            <Image src={fileUrl} alt={content} fill className="tw-object-cover" />
                        </a>
                    )}
                    {isPDF && (
                        <div className=" tw-relative tw-mt-2 tw-flex  tw-items-center tw-rounded-md tw-bg-background/10 tw-p-2">
                            <FileIcon className="tw-h-10 tw-w-10 tw-fill-indigo-200 tw-stroke-indigo-400" />
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className=" tw-m1-2 tw-block tw-w-44 tw-break-words tw-text-sm  tw-text-indigo-500 hover:tw-underline md:tw-w-80 lg:tw-w-80 dark:tw-text-indigo-400 "
                            >
                                PDF 文件
                            </a>
                        </div>
                    )}
                    {!fileUrl && !isEditing && (
                        <p
                            className={cn(
                                'tw-text-sm tw-to-zinc-600 dark:tw-text-zinc-300',
                                deleted &&
                                    'tw-italic tw-text-zinc-500 dark:tw-text-zinc-400 tw-text-xs tw-mt-1',
                            )}
                        >
                            {content}
                            {isUpdated && !deleted && (
                                <span className="tw-mx-2 tw-text-[10px] tw-text-zinc-500 dark:tw-text-zinc-400">
                                    (已更新)
                                </span>
                            )}
                        </p>
                    )}

                    {!fileUrl && isEditing && (
                        <Form {...form}>
                            <form
                                className="tw-flex tw-w-full tw-items-center tw-gap-x-2 tw-pt-2"
                                onSubmit={form.handleSubmit(onSubmit)}
                            >
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem className="tw-flex-1">
                                            <FormControl>
                                                <div className="tw-relative tw-w-full">
                                                    <Input
                                                        disabled={isLoading}
                                                        className="tw-border-0 tw-border-none tw-bg-zinc-200/90
                                                    tw-p-2 tw-text-zinc-600 focus-visible:tw-ring-0 focus-visible:tw-ring-offset-0
                                                    dark:tw-bg-zinc-700/50 dark:tw-text-zinc-200"
                                                        placeholder="请输入修改内容..."
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button size="sm" variant="primary" disabled={isLoading}>
                                    确认修改
                                </Button>
                            </form>
                            <span className="tw-ml-1 tw-mt-1 tw-to-zinc-400 tw-text-[10px]">
                                Escapes键取消 Enter键确认
                            </span>
                        </Form>
                    )}
                </div>
            </div>
            {canDeleteMessage && (
                <div
                    className="twp-1 tw-absolute -tw-top-2 tw-right-5
                        tw-hidden tw-items-center tw-gap-x-2 tw-rounded-sm tw-border tw-bg-white
                        group-hover:tw-flex dark:tw-bg-zinc-800"
                >
                    {canEditMessage && (
                        <ActionTooltip label="编辑">
                            <Edit
                                onClick={() => setIsEditing(true)}
                                className="tw-ml-auto tw-h-4 tw-w-4 tw-cursor-pointer tw-text-zinc-500 tw-transition hover:tw-text-zinc-600 dark:tw-text-zinc-400 dark:hover:tw-to-zinc-500"
                            />
                        </ActionTooltip>
                    )}
                    <ActionTooltip label="删除">
                        <Trash
                            onClick={() =>
                                onOpen('deleteMessage', {
                                    apiUrl: `${socketUrl}/${id}`,
                                    query: socketQuery,
                                })
                            }
                            className="tw-ml-auto tw-h-4 tw-w-4 tw-cursor-pointer tw-text-zinc-500 tw-transition hover:tw-text-zinc-600 dark:tw-text-zinc-400 dark:hover:tw-to-zinc-500"
                        />
                    </ActionTooltip>
                </div>
            )}
        </div>
    );
};
