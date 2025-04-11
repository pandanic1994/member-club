'use client';

import type { FC } from 'react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface ActionTooltipProps {
    label: string;
    children: React.ReactNode;
    side?: 'top' | 'bottom' | 'left' | 'right';
    align?: 'start' | 'center' | 'end';
}

export const ActionTooltip: FC<ActionTooltipProps> = ({
    label,
    children,
    side = 'top',
    align = 'center',
}) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={50}>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent side={side} align={align}>
                    <p className="tw-text-sm tw-font-semibold tw-capitalize">{label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
