import { Link } from '@inertiajs/react';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

type TextLinkProps = ComponentProps<typeof Link>;

export function TextLink({ className, ...props }: TextLinkProps) {
    return (
        <Link
            className={cn(
                'font-medium text-foreground underline decoration-foreground/25 underline-offset-4 transition-colors hover:decoration-foreground',
                className,
            )}
            {...props}
        />
    );
}
