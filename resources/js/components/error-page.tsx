import { Head, Link } from '@inertiajs/react';

import { AppLogo } from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { home } from '@/routes';

interface ErrorPageProps {
    status: number;
    title: string;
    description: string;
}

export function ErrorPage({ status, title, description }: ErrorPageProps) {
    return (
        <>
            <Head title={`${status} · ${title}`} />

            <div className="flex min-h-svh flex-col items-center justify-center gap-10 bg-background px-4 py-12 text-center">
                <AppLogo />

                <div className="flex flex-col items-center gap-5">
                    <span className="text-7xl font-semibold tracking-tighter text-foreground tabular-nums sm:text-8xl">
                        {status}
                    </span>
                    <div className="flex flex-col gap-2">
                        <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
                        <p className="max-w-md text-sm leading-relaxed text-balance text-muted-foreground">
                            {description}
                        </p>
                    </div>
                </div>

                <Button render={<Link href={home()} />} nativeButton={false}>
                    Back to home
                </Button>
            </div>
        </>
    );
}
