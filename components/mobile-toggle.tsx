import { Menu } from 'lucide-react';

import { NavigationSidebar } from './navigation/navigation-sidebar';
import { ServerSidebar } from './server/server-sidebar';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export const MobileToggle = ({ serverId }: { serverId: string }) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:tw-hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="tw-flex tw-gap-0 tw-p-0">
                <div className="tw-w-[72px]">
                    <NavigationSidebar />
                </div>
                <ServerSidebar serverId={serverId} />
            </SheetContent>
        </Sheet>
    );
};
