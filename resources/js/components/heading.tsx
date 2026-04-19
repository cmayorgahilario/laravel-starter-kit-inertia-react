export default function Heading({
    title,
    description,
    variant = 'default',
}: {
    title: string;
    description?: string;
    variant?: 'default' | 'small';
}) {
    if (variant === 'small') {
        return (
            <header className="space-y-1">
                <h2 className="text-base font-semibold tracking-tight">{title}</h2>
                {description && <p className="text-muted-foreground text-sm">{description}</p>}
            </header>
        );
    }

    return (
        <header className="mb-8 space-y-1.5">
            <h2 className="text-foreground text-2xl font-semibold tracking-tight">{title}</h2>
            {description && (
                <p className="text-muted-foreground text-sm text-balance">{description}</p>
            )}
        </header>
    );
}
