import { Server as NetServer } from 'node:http';
import { Server as ServerIO } from 'socket.io';
import { NextApiRequest } from 'next';

import { NextApiResponseServerIo } from '@/types';

export const config = {
    api: {
        bodyParser: false,
    },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
    if (!res.socket.server.io) {
        const path = '/api/socket/io';
        const httpServer: NetServer = res.socket.server as any;
        const io = new ServerIO(httpServer, {
            path: path,
            addTrailingSlash: false,
        });
        res.socket.server.io = io;
    }
    res.socket.end();
};

export default ioHandler;
