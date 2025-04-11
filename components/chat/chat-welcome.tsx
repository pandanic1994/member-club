import { Hash } from 'lucide-react';
import { FC } from 'react';

interface ChatWelcomeProps {
    type: 'channel' | 'conversation';
    name: string;
}

export const ChatWelcome: FC<ChatWelcomeProps> = ({ name, type }) => {
    return (
        <div className="tw-space-y-2 tw-px-4 tw-mb-4">
            {type === 'channel' && (
                <div
                    className="tw-h-[75px] tw-w-[75px]
             tw-rounded-full tw-bg-zinc-500 dark:tw-bg-zinc-700
             tw-flex tw-justify-center tw-items-center"
                >
                    <Hash className="tw-h-12 tw-w-12 tw-text-white" />
                </div>
            )}
            <p className="tw-text-xl md:tw-text-3xl tw-font-bold">
                {type === 'channel' ? `欢迎来到: #` : ''}
                {name}
            </p>
            <p className="tw-text-zinc-500 dark:tw-text-zinc-400 tw-text-sm">
                这里是 {type === 'channel' ? `频道 # ${name}` : `你与${name}对话`} 的开始页面 。
            </p>
        </div>
    );
};
