import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { auth } from '@clerk/nextjs/server';

const f = createUploadthing();
const handleAuth = async () => {
    const { userId } = await auth();
    if (!userId) throw new UploadThingError('Unauthorized');
    return { userId: userId };
};

export const ourFileRouter = {
    serverImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
        .middleware(async () => await handleAuth())
        .onUploadComplete(() => {}),
    messageFile: f(['text', 'image', 'pdf'])
        .middleware(async () => await handleAuth())
        .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
