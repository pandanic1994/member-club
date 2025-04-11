'use client';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import qs from 'query-string';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import { useModal } from '@/hooks/use-modal-store';
import { ChannelType } from '@prisma/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useEffect } from 'react';

const formSchema = z.object({
    name: z
        .string()
        .min(1, { message: '请输入频道名称' })
        .refine((name) => name !== 'general', { message: "频道名称不能是'general'" }),
    type: z.nativeEnum(ChannelType),
});

export const CreateChannelModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();
    const params = useParams();
    const isModalOpen = isOpen && type === 'createChannel';
    const { channelType } = data;

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { name: '', type: ChannelType.TEXT },
    });

    useEffect(() => {
        if (channelType) {
            form.setValue('type', channelType);
        } else {
            form.setValue('type', ChannelType.TEXT);
        }
    }, [channelType, form]);

    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: '/api/channels',
                query: {
                    serverId: params?.serverId,
                },
            });
            await axios.post(url, values);
            form.reset();
            router.refresh();
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    const handleClose = () => {
        form.reset();
        onClose();
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent
                className="tw-overflow-hidden
             tw-bg-white tw-p-0 tw-text-black"
            >
                <DialogHeader className="tw-px-6 tw-pt-8">
                    <DialogTitle className="tw-text-center tw-text-2xl">创建频道</DialogTitle>
                    <DialogDescription className="tw-text-center tw-text-zinc-500">
                        创建一个新的频道
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="tw-space-y-8">
                        <div className="tw-space-y-8 tw-px-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel
                                                className="tw-uppercase tw-text-xs tw-font-bold 
                                            tw-text-zinc-500 dark:tw-text-secondary/70"
                                            >
                                                频道名称
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isLoading}
                                                    className="tw-bg-zinc-300/50 tw-border-0 
                                                    focus-visible:tw-ring-0 tw-text-black 
                                                    focus-visible:tw-ring-offset-0"
                                                    placeholder="输入频道名称"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />

                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>频道类型</FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    className="tw-bg-zinc-300/50
                                                tw-border-0 focus:tw-ring-0 tw-text-black tw-ring-offset-0
                                                focus:tw-offset-0 tw-capitalize tw-outline-none"
                                                >
                                                    <SelectValue placeholder="选择创建的频道类型" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(ChannelType).map((type) => {
                                                    return (
                                                        <SelectItem
                                                            key={type}
                                                            value={type}
                                                            className="tw-capitalize"
                                                        >
                                                            {type.toLowerCase()}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="tw-bg-gray-100 tw-px-6 tw-py-4">
                            <Button variant="primary" disabled={isLoading}>
                                创建
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
