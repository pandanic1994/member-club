import { FC } from 'react';
import { Avatar, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
    className?: string;
    src?: string;
}

export const UserAvatar: FC<UserAvatarProps> = ({ src, className }) => {
    return (
        <Avatar className={cn('tw-h-7 tw-w-7 md:tw-h-10 md:tw-w-10', className)}>
            <AvatarImage src={src} />
        </Avatar>
    );
};
