import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const profile = await currentProfile();
        const { name, type } = await req.json();
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get('serverId');
        if (!serverId) {
            return new NextResponse('serverId missing', { status: 400 });
        }
        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                member: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                        },
                    },
                },
            },
            data: {
                channel: {
                    create: {
                        profileId: profile.id,
                        name,
                        type,
                    },
                },
            },
        });
        return NextResponse.json(server);
    } catch (error) {
        console.log('CHANNEL_POST', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
