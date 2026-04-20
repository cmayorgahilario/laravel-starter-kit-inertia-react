import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { app } = usePage().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-6 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col overflow-hidden bg-neutral-950 p-10 text-neutral-50 lg:flex">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.10),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.08),transparent_60%)]"
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.45))]"
                />
                <Link
                    href={home()}
                    className="relative z-20 flex items-center gap-3 text-lg font-medium"
                >
                    <div className="flex size-9 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15 backdrop-blur">
                        <AppLogoIcon className="size-5 fill-current text-white" />
                    </div>
                    <span className="tracking-tight">{app.name}</span>
                </Link>
                <div className="relative z-20 mt-auto space-y-3">
                    <p className="text-lg leading-relaxed text-balance text-neutral-100/90">
                        Ship faster with a refined Laravel + React foundation —
                        authentication, settings and layouts, ready on day one.
                    </p>
                    <p className="text-sm text-neutral-400">
                        The {app.name} team
                    </p>
                </div>
            </div>
            <div className="w-full lg:p-10">
                <div className="mx-auto flex w-full flex-col justify-center gap-8 sm:w-[360px]">
                    <Link
                        href={home()}
                        className="relative z-20 flex items-center justify-center lg:hidden"
                    >
                        <AppLogoIcon className="h-10 fill-current text-foreground sm:h-12" />
                    </Link>
                    <div className="flex flex-col gap-1.5 text-left sm:items-center sm:text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {title}
                        </h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
