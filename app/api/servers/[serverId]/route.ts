import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
    try {
        const { serverId } = await params;

        const { name, imageUrl } = await req.json();
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
                profileId: profile.id,
            },
            data: {
                name,
                imageUrl,
            },
        });
        return NextResponse.json(server);
    } catch (error) {
        console.log('[SERVERS_PATCH]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { serverId: string } }) {
    try {
        const { serverId } = await params;

        const profile = await currentProfile();
        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        if (!serverId) {
            return redirect('/');
        }

        const server = await db.server.delete({
            where: {
                id: serverId,
                profileId: profile.id,
            },
        });
        return NextResponse.json(server);
    } catch (error) {
        console.log('[SERVERS_DELETE]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
