import { Server as NetServer, Socket } from 'net';
import { NextResponse } from 'next/server';
import { Server as SocketIOServer } from 'socket.io';
import { Member, Profile, Server } from '@prisma/client';
import { NextApiResponse } from 'next';

export type ServerWithMembersWithProfiles = Server & {
    member: (Member & { profile: Profile })[];
};

export type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: SocketIOServer;
        };
    };
};
