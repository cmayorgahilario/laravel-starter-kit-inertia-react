import { Link, usePage } from '@inertiajs/react';

import { cn } from '@/lib/utils';
import { home } from '@/routes';
import type { SharedData } from '@/types';

export function AppLogo({ className }: { className?: string }) {
    // Error pages render without the `web` middleware group, so Inertia's shared
    // props are absent there; fall back to the build-time app name.
    const name = usePage<SharedData>().props.name ?? import.meta.env.VITE_APP_NAME;

    return (
        <Link
            href={home()}
            className={cn('group inline-flex items-center gap-2.5 transition-opacity hover:opacity-80', className)}
        >
            <span className="flex size-7 shrink-0 items-center justify-center bg-primary text-[13px] font-bold text-primary-foreground lowercase">
                {name.charAt(0)}
            </span>
            <span className="text-sm font-semibold tracking-[0.22em] text-foreground uppercase">{name}</span>
        </Link>
    );
}
