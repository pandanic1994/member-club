'use client';

import { Search } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { type FC, useEffect, useState } from 'react';

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '../ui/command';

interface ServerSearchProp {
    data: {
        label: string;
        type: 'channel' | 'member';
        data:
            | {
                  icon: React.ReactNode;
                  name: string;
                  id: string;
              }[]
            | undefined;
    }[];
}
export const ServerSearch: FC<ServerSearchProp> = ({ data }) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const params = useParams();
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const onClick = ({ id, type }: { id: string; type: 'channel' | 'member' }) => {
        setOpen(false);
        if (type === 'member') {
            return router.push(`/servers/${params?.serverId}/conversation/${id}`);
        }
        if (type === 'channel') {
            return router.push(`/servers/${params?.serverId}/channels/${id}`);
        }
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                type="button"
                className="group tw-flex tw-w-full  tw-items-center tw-gap-x-2 tw-rounded-md tw-px-2 tw-py-2 
            tw-transition hover:tw-bg-zinc-700/10 dark:hover:tw-bg-zinc-700/50"
            >
                <Search className="tw-h-4 tw-w-4 tw-text-zinc-400 dark:tw-text-zinc-400" />
                <p
                    className="tw-text-sm tw-font-semibold 
                    tw-text-zinc-500 tw-transition
                     group-hover:tw-text-zinc-600
                dark:tw-text-zinc-400 dark:group-hover:tw-text-zinc-300"
                >
                    Search
                </p>
                <kbd
                    className="tw-pointer-events-none tw-ml-auto tw-inline-flex
                tw-h-5 tw-select-none tw-items-center tw-gap-1 tw-rounded tw-border
                tw-bg-muted tw-p-1.5 tw-font-mono tw-text-[10px] tw-font-medium
                tw-text-muted-foreground"
                >
                    <span className="tw-text-xs">CMD</span>K
                </kbd>
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="搜索全部频道或者成员" />
                <CommandList>
                    <CommandEmpty>没有找到结果</CommandEmpty>
                    {data.map(({ data, label, type }) => {
                        if (!data?.length) return null;
                        return (
                            <CommandGroup key={label} heading={label}>
                                {data?.map(({ id, icon, name }) => {
                                    return (
                                        <CommandItem
                                            onSelect={() => onClick({ id, type })}
                                            key={id}
                                        >
                                            {icon}
                                            <span>{name}</span>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        );
                    })}
                </CommandList>
            </CommandDialog>
        </>
    );
};
