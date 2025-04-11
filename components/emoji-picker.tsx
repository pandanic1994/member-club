'use client';
import type { FC } from 'react';

import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Smile } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface EmojiPickerProps {
    onChange: (value: string) => void;
}

export const EmojiPicker: FC<EmojiPickerProps> = ({ onChange }) => {
    const { resolvedTheme } = useTheme();

    return (
        <Popover>
            <PopoverTrigger>
                <Smile className="tw-text-zinc-500 tw-transition hover:tw-text-zinc-600 dark:tw-text-zinc-400 dark:hover:tw-to-zinc-300" />
            </PopoverTrigger>
            <PopoverContent
                side="right"
                sideOffset={40}
                className="tw-mb-16 tw-border-none tw-bg-transparent tw-shadow-none tw-drop-shadow-none"
            >
                <Picker
                    locale="zh"
                    theme={resolvedTheme}
                    data={data}
                    onEmojiSelect={(emoji: any) => onChange(emoji)}
                />
            </PopoverContent>
        </Popover>
    );
};
