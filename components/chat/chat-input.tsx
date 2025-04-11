'use client';
import type { FC } from 'react';

import { useModal } from '@/hooks/use-modal-store';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import qs from 'query-string';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { EmojiPicker } from '../emoji-picker';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { Input } from '../ui/input';

interface ChatInputProps {
    apiUrl: string;
    query: Record<string, any>;
    name: string;
    type: 'conversation' | 'channel';
}

const formSchema = z.object({
    content: z.string().min(1),
});

export const ChatInput: FC<ChatInputProps> = ({ apiUrl, query, name, type }) => {
    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: { content: '' },
        resolver: zodResolver(formSchema),
    });

    const router = useRouter();

    const { onOpen } = useModal();

    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({ url: apiUrl, query });

            await axios.post(url, values);
            form.reset();
            router.refresh();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="tw-relative tw-p-4 tw-pb-6">
                                    <button
                                        type="button"
                                        className="tw-absolute tw-left-8 tw-top-7 tw-flex tw-h-[24px]
                                        tw-w-[24px] tw-items-center tw-justify-center
                                         tw-rounded-full tw-bg-zinc-500 tw-p-1 tw-transition
                                         hover:tw-bg-zinc-600 dark:tw-bg-zinc-400 dark:hover:tw-bg-zinc-300"
                                        onClick={() => {
                                            onOpen('messageFile', { apiUrl, query });
                                        }}
                                    >
                                        <Plus className="tw-text-white  dark:tw-text-[#313338]" />
                                    </button>
                                    <Input
                                        disabled={isLoading}
                                        className="tw-border-0
                                    tw-border-none tw-bg-zinc-200/90
                                    !tw-px-14 tw-py-6 tw-text-zinc-600
                                    focus-visible:tw-ring-0 focus-visible:tw-ring-offset-0
                                    dark:tw-bg-zinc-700/75 dark:tw-text-zinc-200"
                                        placeholder={`消息发送至  ${type === 'conversation' ? `@${name}` : `#${name}`}`}
                                        {...field}
                                    ></Input>
                                    <div className="tw-absolute tw-right-8 tw-top-7">
                                        <EmojiPicker
                                            onChange={(emoji: any) =>
                                                field.onChange(`${field.value} ${emoji.native}`)
                                            }
                                        />
                                    </div>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
};
