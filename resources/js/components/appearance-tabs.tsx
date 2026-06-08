import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import type { ComponentType } from 'react';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useAppearance } from '@/hooks/use-appearance';
import type { Appearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

const options: { value: Appearance; label: string; icon: ComponentType }[] = [
    { value: 'light', label: 'Light', icon: SunIcon },
    { value: 'dark', label: 'Dark', icon: MoonIcon },
    { value: 'system', label: 'System', icon: MonitorIcon },
];

export function AppearanceTabs({ className }: { className?: string }) {
    const { appearance, updateAppearance } = useAppearance();

    return (
        <ToggleGroup
            value={[appearance]}
            onValueChange={(value: string[]) => {
                const next = value[0] as Appearance | undefined;

                if (next) {
                    updateAppearance(next);
                }
            }}
            variant="outline"
            className={cn('w-full', className)}
        >
            {options.map(({ value, label, icon: Icon }) => (
                <ToggleGroupItem
                    key={value}
                    value={value}
                    aria-label={label}
                    className="h-auto flex-1 flex-col gap-1.5 py-2.5"
                >
                    <Icon />
                    {label}
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    );
}
