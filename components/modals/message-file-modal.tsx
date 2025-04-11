'use client';
import { FileUpload } from '@/components/file-upload';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { useModal } from '@/hooks/use-modal-store';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import qs from 'query-string';
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
    fileUrl: z.string().min(1, { message: '请上传文件' }),
});

export const MessageFileModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();
    const isModalOpen = isOpen && type === 'messageFile';

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { fileUrl: '' },
    });
    const { apiUrl, query } = data;

    const handleClose = () => {
        form.reset();
        onClose();
    };
    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl || '',
                query,
            });
            await axios.post(url, {
                ...values,
                content: values.fileUrl,
            });
            form.reset();
            router.refresh();
            handleClose();
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent
                className="tw-overflow-hidden
             tw-bg-white tw-p-0 tw-text-black"
            >
                <DialogHeader className="tw-px-6 tw-pt-8">
                    <DialogTitle className="tw-text-center tw-text-2xl">上传文件</DialogTitle>
                    <DialogDescription className="tw-text-center tw-text-zinc-500">
                        上传文件到消息中
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="tw-space-y-8">
                        <div className="tw-space-y-8 tw-px-6">
                            <div className="tw-flex tw-items-center tw-justify-center tw-text-center">
                                <FormField
                                    control={form.control}
                                    name="fileUrl"
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormControl>
                                                    <FileUpload
                                                        endPoint="messageFile"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        );
                                    }}
                                />
                            </div>
                        </div>
                        <DialogFooter className="tw-bg-gray-100 tw-px-6 tw-py-4">
                            <Button variant="primary" disabled={isLoading}>
                                发送
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
