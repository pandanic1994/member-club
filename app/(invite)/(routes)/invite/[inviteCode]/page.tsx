import type { FC } from 'react';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { RedirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

interface InviteCodePageProps {
    params: {
        inviteCode: string;
    };
}

const InviteCodePage: FC<InviteCodePageProps> = async ({ params }) => {
    const { inviteCode } = await params;
    const profile = await currentProfile();
    if (!profile) {
        return RedirectToSignIn({});
    }
    if (!inviteCode) {
        return redirect('/');
    }

    const existInviteCode = await db.server.findFirst({
        where: {
            inviteCode,
            member: {
                some: { profileId: profile.id },
            },
        },
    });

    if (existInviteCode) {
        return redirect(`/servers/${existInviteCode.id}`);
    }
    const server = await db.server.update({
        where: { inviteCode },
        data: { member: { create: { profileId: profile.id } } },
    });

    if (server) {
        return redirect(`/servers/${server.id}`);
    }

    return null;
};

export default InviteCodePage;
