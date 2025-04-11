import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { UserButton } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { ModeToggle } from '../mode-toggle';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { NavigationAction } from './navigation-action';
import { NavigationItem } from './navigation-item';

export const NavigationSidebar = async () => {
    const profile = await currentProfile();

    if (!profile) {
        return redirect('/');
    }

    const servers = await db.server.findMany({
        where: {
            member: {
                some: { profileId: profile.id },
            },
        },
    });

    return (
        <div
            className=" tw-flex tw-h-full
    tw-w-full tw-flex-col tw-items-center 
    tw-space-y-4 tw-bg-[#E3E5e8] tw-py-3 tw-text-primary dark:tw-bg-[#1E1F22]"
        >
            <NavigationAction />
            <Separator className="tw-mx-auto tw-h-[2px] tw-w-10 tw-rounded-md tw-bg-zinc-300 dark:tw-bg-zinc-700" />
            <ScrollArea className="tw-w-full tw-flex-1">
                {servers.map((server) => {
                    return (
                        <div key={server.id} className="tw-mb-4">
                            <NavigationItem
                                id={server.id}
                                name={server.name}
                                imageUrl={server.imageUrl}
                            />
                        </div>
                    );
                })}
            </ScrollArea>
            <div className="tw-item-center tw-flex tw-flex-col tw-gap-y-4 tw-pb-3">
                <ModeToggle />
                <UserButton
                    appearance={{
                        elements: {
                            avatarBox: 'tw-h-[48px] tw-w-[48px]',
                        },
                    }}
                />
            </div>
        </div>
    );
};
