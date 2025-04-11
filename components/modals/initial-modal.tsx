'use client';
import { FileUpload } from '@/components/file-upload';
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
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';

const formSchema = z.object({
    name: z.string().min(1, { message: '请输入服务器名称' }),
    imageUrl: z.string().min(1, { message: '请上传服务器图片' }),
});

export const InitialModal = () => {
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { name: '', imageUrl: '' },
    });

    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post('api/servers', values);
            form.reset();
            router.refresh();
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };
    if (!isMounted) {
        return null;
    }
    return (
        <Dialog open>
            <DialogContent
                className="tw-overflow-hidden
             tw-bg-white tw-p-0 tw-text-black"
            >
                <DialogHeader className="tw-px-6 tw-pt-8">
                    <DialogTitle className="tw-text-center tw-text-2xl">
                        创建属于你的服务
                    </DialogTitle>
                    <DialogDescription className="tw-text-center tw-text-zinc-500">
                        创建你的私人定制化服务设置，之后你可以随时更改这些设置。
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="tw-space-y-8">
                        <div className="tw-space-y-8 tw-px-6">
                            <div className="tw-flex tw-items-center tw-justify-center tw-text-center">
                                <FormField
                                    control={form.control}
                                    name="imageUrl"
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormControl>
                                                    <FileUpload
                                                        endPoint="serverImage"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        );
                                    }}
                                />
                            </div>

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
                                                服务器名称
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isLoading}
                                                    className="tw-bg-zinc-300/50 tw-border-0 
                                                    focus-visible:tw-ring-0 tw-text-black 
                                                    focus-visible:tw-ring-offset-0"
                                                    placeholder="输入服务器名称"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
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
