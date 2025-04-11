'use client';
import qs from 'query-string';
import { ServerWithMembersWithProfiles } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { useModal } from '@/hooks/use-modal-store';
import { ScrollArea } from '../ui/scroll-area';
import { UserAvatar } from '../user-avatar';
import {
    Check,
    Gavel,
    Loader2,
    MoreVertical,
    Shield,
    ShieldAlert,
    ShieldCheck,
    ShieldQuestion,
} from 'lucide-react';
import { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { MemberRole } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const roleIconMap = {
    GUEST: null,
    MODERATOR: <ShieldCheck className="tw-h-4 tw-w-4 tw-ml-2 tw-text-indigo-500" />,
    ADMIN: <ShieldAlert className="tw-h-4 tw-w-4  tw-text-red-500" />,
};

export const MembersModal = () => {
    const { onOpen, isOpen, onClose, type, data } = useModal();
    const [loadingId, setLoadingId] = useState<string>('');
    const router = useRouter();
    const isModalOpen = isOpen && type === 'members';
    const { server } = data as { server: ServerWithMembersWithProfiles };

    const onRoleChange = async (memberId: string, role: MemberRole) => {
        try {
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id,
                },
            });
            const response = await axios.patch(url, { role });
            router.refresh();
            onOpen('members', { server: response.data });
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingId('');
        }
    };

    const onKick = async (memberId: string) => {
        try {
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id,
                },
            });
            const response = await axios.delete(url);
            router.refresh();
            onOpen('members', { server: response.data });
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingId('');
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent
                className="tw-overflow-hidden
             tw-bg-white  tw-text-black"
            >
                <DialogHeader className="tw-px-6 tw-pt-8">
                    <DialogTitle className="tw-text-center tw-text-2xl">成员管理</DialogTitle>
                    <DialogDescription
                        className="tw-text-center 
                    tw-text-zinc-500"
                    >
                        {server?.member?.length} 个成员
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="tw-mt-10 tw-max-h-[420px] tw-pr-6">
                    {server?.member?.map((member) => {
                        return (
                            <div
                                key={member.id}
                                className="tw-flex tw-items-center
                                 tw-gap-x-2 tw-mb-6"
                            >
                                <UserAvatar src={member.profile.imageUrl} />
                                <div className="tw-flex tw-flex-col tw-gap-y-1 ">
                                    <div className="tw-text-xs tw-font-semibold tw-flex tw-items-center">
                                        {member.profile.name}
                                        {roleIconMap[member.role]}
                                    </div>
                                    <p className="tw-text-xs tw-text-zinc-500">
                                        {member.profile.email}
                                    </p>
                                </div>
                                {server.profileId !== member.profileId &&
                                    loadingId !== member.id && (
                                        <div className="tw-ml-auto">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <MoreVertical className="tw-h-4 tw-w-4 tw-text-zinc-500" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent side="left">
                                                    <DropdownMenuSub>
                                                        <DropdownMenuSubTrigger className="tw-flex tw-items-center">
                                                            <ShieldQuestion className="tw-w-4 tw-h-4 tw-mr-2" />
                                                            <span>role</span>
                                                        </DropdownMenuSubTrigger>
                                                        <DropdownMenuPortal>
                                                            <DropdownMenuSubContent>
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        onRoleChange(
                                                                            member.id,
                                                                            'GUEST',
                                                                        )
                                                                    }
                                                                >
                                                                    <Shield className="tw-h-4 tw-w-4 tw-mr-2" />
                                                                    Guests
                                                                    {member.role === 'GUEST' && (
                                                                        <Check className="tw-h-4 tw-w-4 tw-ml-auto" />
                                                                    )}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        onRoleChange(
                                                                            member.id,
                                                                            'MODERATOR',
                                                                        )
                                                                    }
                                                                >
                                                                    <Shield className="tw-h-4 tw-w-4 tw-mr-2" />
                                                                    Moderator
                                                                    {member.role ===
                                                                        'MODERATOR' && (
                                                                        <Check className="tw-h-4 tw-w-4 tw-ml-auto" />
                                                                    )}
                                                                </DropdownMenuItem>
                                                            </DropdownMenuSubContent>
                                                        </DropdownMenuPortal>
                                                    </DropdownMenuSub>

                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            onKick(member.id);
                                                        }}
                                                    >
                                                        <Gavel className="tw-w-4 tw-h-4 tw-mr-2" />
                                                        踢出
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    )}
                                {loadingId === member.id && (
                                    <Loader2 className="tw-animate-spin tw-text-zinc-500 tw-ml-auto tw-w-4 tw-h-4" />
                                )}
                            </div>
                        );
                    })}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};
