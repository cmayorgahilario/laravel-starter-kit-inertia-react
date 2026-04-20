import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(ellipse_at_center,theme(colors.background/60%),transparent_70%)]"
            />
            <div className="relative z-10 flex w-full max-w-md flex-col gap-6">
                <Link
                    href={home()}
                    className="flex items-center gap-2 self-center font-medium"
                >
                    <div className="flex size-11 items-center justify-center rounded-xl bg-foreground text-background shadow-sm">
                        <AppLogoIcon className="size-6 fill-current" />
                    </div>
                </Link>

                <Card className="rounded-xl border-border/60 shadow-xs">
                    <CardHeader className="space-y-1.5 px-8 pt-8 pb-0 text-center">
                        <CardTitle className="text-xl font-semibold tracking-tight">
                            {title}
                        </CardTitle>
                        <CardDescription className="text-sm text-balance">
                            {description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 py-8">{children}</CardContent>
                </Card>
            </div>
        </div>
    );
}
