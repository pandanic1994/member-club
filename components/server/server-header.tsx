/* eslint-disable react-dom/no-missing-button-type */
'use client';

import type { ServerWithMembersWithProfiles } from '@/types';
import type { FC } from 'react';

import { useModal } from '@/hooks/use-modal-store';
import { MemberRole } from '@prisma/client';
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles;
    role?: MemberRole;
}

export const ServerHeader: FC<ServerHeaderProps> = ({ server, role }) => {
    const isAdmin = role === MemberRole.ADMIN;
    const isModerator = isAdmin || role === MemberRole.MODERATOR;

    const { onOpen } = useModal();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="focus:tw-outline-none">
                <button
                    className="hover:bg-zinc-700/10 dark:hover:tw-bg-zinc-700/500 tw-flex tw-h-12 tw-w-full tw-items-center tw-border-b-2
                tw-border-neutral-200 tw-px-3 
                tw-text-base tw-font-semibold
                tw-transition dark:tw-border-neutral-800"
                >
                    {server.name}
                    <ChevronDown className="tw-ml-auto tw-h-5 tw-w-5" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="tw-w-56 tw-space-y-[2px] tw-text-xs tw-font-medium
            tw-text-black dark:tw-text-neutral-400"
            >
                {isModerator && (
                    <DropdownMenuItem
                        onClick={() => onOpen('invite', { server })}
                        className="
                tw-cursor-pointer tw-px-3 
                tw-py-2 tw-text-sm tw-text-indigo-600 
                dark:tw-text-indigo-400"
                    >
                        邀请成员
                        <UserPlus className="tw-ml-auto tw-h-4 tw-w-4" />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => onOpen('editServer', { server })}
                        className="
                tw-cursor-pointer tw-px-3 tw-py-2 
                tw-text-sm"
                    >
                        服务器设置
                        <Settings className="tw-ml-auto tw-h-4 tw-w-4" />
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => {
                            onOpen('members', { server });
                        }}
                        className="
                tw-cursor-pointer tw-px-3 tw-py-2 
                tw-text-sm"
                    >
                        成员管理
                        <Users className="tw-ml-auto tw-h-4 tw-w-4" />
                    </DropdownMenuItem>
                )}
                {isModerator && (
                    <DropdownMenuItem
                        onClick={() => onOpen('createChannel', { server })}
                        className="
                tw-cursor-pointer tw-px-3 tw-py-2 
                tw-text-sm"
                    >
                        创建频道
                        <PlusCircle className="tw-ml-auto tw-h-4 tw-w-4" />
                    </DropdownMenuItem>
                )}
                {isModerator && <DropdownMenuSeparator />}
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => {
                            onOpen('deleteServer', { server });
                        }}
                        className="
                        tw-cursor-pointer
                tw-px-3 tw-py-2 tw-text-sm 
                tw-text-rose-500"
                    >
                        删除服务
                        <Trash className="tw-ml-auto tw-h-4 tw-w-4" />
                    </DropdownMenuItem>
                )}

                {!isAdmin && (
                    <DropdownMenuItem
                        onClick={() => {
                            onOpen('leaveServer', { server });
                        }}
                        className="
                        tw-cursor-pointer
                tw-px-3 tw-py-2 tw-text-sm 
                tw-text-rose-500"
                    >
                        退出服务
                        <LogOut className="tw-ml-auto tw-h-4 tw-w-4" />
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
