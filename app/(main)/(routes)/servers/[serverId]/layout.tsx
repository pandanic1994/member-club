import { ServerSidebar } from '@/components/server/server-sidebar';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { RedirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const ServerIdLayout = async ({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { serverId: string };
}) => {
    const { serverId } = await params;
    const profile = await currentProfile();
    if (!profile) {
        return RedirectToSignIn({});
    }

    const server = db.server.findUnique({
        where: { id: serverId, member: { some: { profileId: profile.id } } },
    });
    if (!server) {
        return redirect('/');
    }

    return (
        <div className="tw-h-full">
            <div
                className="tw-hidden md:tw-flex tw-h-full tw-w-60 tw-z-20
            tw-flex-col tw-fixed tw-inset-y-0"
            >
                <ServerSidebar serverId={serverId} />
            </div>
            <main className="tw-h-full md:tw-pl-60"> {children}</main>
        </div>
    );
};

export default ServerIdLayout;
