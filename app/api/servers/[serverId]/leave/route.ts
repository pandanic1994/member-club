import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
    try {
        const { serverId } = await params;

        const profile = await currentProfile();
        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        if (!serverId) {
            return redirect('/');
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: {
                    not: profile.id,
                },
                member: {
                    some: {
                        profileId: profile.id,
                    },
                },
            },
            data: {
                member: {
                    deleteMany: {
                        profileId: profile.id,
                    },
                },
            },
        });
        return NextResponse.json(server);
    } catch (error) {
        console.log('[SERVERS_ID]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
