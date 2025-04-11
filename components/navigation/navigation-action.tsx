'use client';

import { Plus } from 'lucide-react';
import { ActionTooltip } from '../action-tooltip';
import { useModal } from '@/hooks/use-modal-store';

export const NavigationAction = () => {
    const { onOpen } = useModal();

    return (
        <div>
            <ActionTooltip side="right" align="center" label="add a server">
                <button
                    onClick={() => onOpen('createServer')}
                    className="tw-group tw-flex tw-items-center"
                >
                    <div
                        className="tw-mx-3 tw-flex tw-h-[48px] tw-w-[48px]
            tw-items-center tw-justify-center tw-overflow-hidden
            tw-rounded-[24px] tw-bg-background tw-transition-all 
            group-hover:tw-rounded-[16px]
            group-hover:tw-bg-emerald-500 dark:tw-bg-neutral-700"
                    >
                        <Plus
                            className="group-hover:tw-text-white tw-transition
                    tw-text-emerald-500"
                            size={25}
                        />
                    </div>
                </button>
            </ActionTooltip>
        </div>
    );
};
