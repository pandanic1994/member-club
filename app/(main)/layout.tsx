import type { FC, PropsWithChildren } from 'react';

import { NavigationSidebar } from '@/components/navigation/navigation-sidebar';

const MainLayout: FC<PropsWithChildren> = async ({ children }) => {
    return (
        <div className="tw-h-full">
            <div
                className="tw-fixed tw-inset-y-0 tw-z-30
       tw-hidden tw-h-full tw-w-[72px] tw-flex-col md:tw-flex"
            >
                <NavigationSidebar />
            </div>
            <main className="tw-h-full md:tw-pl-[72px]"> {children}</main>
        </div>
    );
};

export default MainLayout;
