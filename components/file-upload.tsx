'use client';
import type { FC } from 'react';

import '@uploadthing/react/styles.css';
import { UploadDropzone } from '@/lib/uploadthing';
import { FileIcon, X } from 'lucide-react';
import Image from 'next/image';

interface FileUploadProps {
    endPoint: 'messageFile' | 'serverImage';
    value: string;
    onChange: (url?: string) => void;
}

export const FileUpload: FC<FileUploadProps> = ({ endPoint, value, onChange }) => {
    const stringValue = value?.split('#');
    const fileType = stringValue.pop();

    if (value && !fileType?.includes('pdf')) {
        return (
            <div className="tw-relative tw-h-20 tw-w-20">
                {fileType}
                <Image fill sizes="10" src={value} alt="Upload" className="tw-rounded-full" />
                <button
                    onClick={() => onChange('')}
                    className="tw-absolute tw-right-0 tw-top-0 tw-rounded-full  tw-bg-rose-500 tw-p-1 tw-text-white tw-shadow-sm"
                    type="button"
                >
                    <X className="tw-h-4 tw-w-4" />
                </button>
            </div>
        );
    }
    if (value && fileType?.includes('pdf')) {
        return (
            <div className=" tw-relative tw-mt-2 tw-flex  tw-items-center tw-rounded-md tw-bg-background/10 tw-p-2">
                <FileIcon className="tw-h-10 tw-w-10 tw-fill-indigo-200 tw-stroke-indigo-400" />
                <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" tw-m1-2 tw-block tw-w-44 tw-break-words tw-text-sm  tw-text-indigo-500 hover:tw-underline md:tw-w-80 lg:tw-w-80 dark:tw-text-indigo-400 "
                >
                    {value}
                </a>
                <button
                    onClick={() => onChange('')}
                    className="tw-absolute -tw-right-2 -tw-top-2 tw-rounded-full  tw-bg-rose-500 tw-p-1 tw-text-white tw-shadow-sm"
                    type="button"
                >
                    <X className="tw-h-4 tw-w-4" />
                </button>
            </div>
        );
    }
    return (
        <div>
            <UploadDropzone
                endpoint={endPoint}
                onClientUploadComplete={(res) => {
                    onChange(`${res?.[0].ufsUrl}#${res?.[0].type}`);
                }}
                onUploadError={(err) => {
                    console.log(err);
                }}
            />
        </div>
    );
};
