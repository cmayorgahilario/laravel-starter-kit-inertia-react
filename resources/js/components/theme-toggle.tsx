import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import type { ComponentType } from 'react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppearance } from '@/hooks/use-appearance';
import type { Appearance } from '@/hooks/use-appearance';

const options: { value: Appearance; label: string; icon: ComponentType }[] = [
    { value: 'light', label: 'Light', icon: SunIcon },
    { value: 'dark', label: 'Dark', icon: MoonIcon },
    { value: 'system', label: 'System', icon: MonitorIcon },
];

export function ThemeToggle() {
    const { appearance, updateAppearance } = useAppearance();
    const ActiveIcon = appearance === 'dark' ? MoonIcon : appearance === 'light' ? SunIcon : MonitorIcon;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Toggle theme" />}>
                <ActiveIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-40">
                <DropdownMenuGroup>
                    {options.map(({ value, label, icon: Icon }) => (
                        <DropdownMenuItem key={value} onClick={() => updateAppearance(value)}>
                            <Icon />
                            {label}
                            {appearance === value ? <CheckIcon className="ml-auto" /> : null}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
