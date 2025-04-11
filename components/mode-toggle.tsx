'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import * as React from 'react';

export function ModeToggle() {
    const { setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="tw-bg-transparent tw-border-0" variant="outline" size="icon">
                    <Sun className="tw-h-[1.2rem] tw-w-[1.2rem] tw-rotate-0 tw-scale-100 tw-transition-all dark:-tw-rotate-90 dark:tw-scale-0" />
                    <Moon className="tw-absolute tw-h-[1.2rem] tw-w-[1.2rem] tw-rotate-90 tw-scale-0 tw-transition-all dark:tw-rotate-0 dark:tw-scale-100" />
                    <span className="tw-sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
