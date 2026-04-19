import { Link } from '@inertiajs/react';

import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="bg-background relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div
                aria-hidden
                className="bg-[radial-gradient(ellipse_at_top,theme(colors.foreground/8%),transparent_60%)] pointer-events-none absolute inset-x-0 top-0 -z-10 h-64"
            />
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-5">
                        <Link
                            href={home()}
                            className="ring-border/70 ring-offset-background hover:ring-border flex items-center justify-center rounded-xl ring-1 ring-offset-2 transition-colors"
                        >
                            <div className="bg-foreground text-background flex size-12 items-center justify-center rounded-xl">
                                <AppLogoIcon className="size-6 fill-current" />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-1.5 text-center">
                            <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
                            <p className="text-muted-foreground text-sm text-balance">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
