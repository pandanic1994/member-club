import type { FC } from 'react';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { RedirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

interface ServerIdPageProps {
    params: { serverId: string };
}

const ServerIdPage: FC<ServerIdPageProps> = async ({ params }) => {
    const { serverId } = await params;
    const profile = await currentProfile();
    if (!profile) {
        return RedirectToSignIn({});
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId,
            member: {
                some: {
                    profileId: profile.id,
                },
            },
        },
        include: {
            channel: {
                where: {
                    name: 'general',
                },
                orderBy: {
                    createdAt: 'asc',
                },
            },
        },
    });

    const initialChannel = server?.channel[0];
    if (initialChannel?.name !== 'general') {
        return null;
    }
    return redirect(`/servers/${serverId}/channels/${initialChannel?.id}`);
};

export default ServerIdPage;
