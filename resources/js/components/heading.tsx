import { cn } from '@/lib/utils';

interface HeadingProps {
    title: string;
    description?: string;
    className?: string;
}

export function Heading({ title, description, className }: HeadingProps) {
    return (
        <div className={cn('flex flex-col gap-1.5', className)}>
            <h1 className="text-2xl font-semibold tracking-tight text-balance text-foreground">{title}</h1>
            {description ? (
                <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">{description}</p>
            ) : null}
        </div>
    );
}
