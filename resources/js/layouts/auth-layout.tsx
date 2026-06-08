import { usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

import { AppLogo } from '@/components/app-logo';
import type { SharedData } from '@/types';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const { name } = usePage<SharedData>().props;

    return (
        <div className="flex min-h-svh flex-col bg-background">
            <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
                <div className="flex w-full max-w-sm flex-col gap-10">
                    <div className="flex flex-col items-center gap-8">
                        <AppLogo />
                        {title || description ? (
                            <div className="flex flex-col items-center gap-2 text-center">
                                {title ? (
                                    <h1 className="text-2xl font-semibold tracking-tight text-balance text-foreground">
                                        {title}
                                    </h1>
                                ) : null}
                                {description ? (
                                    <p className="text-sm leading-relaxed text-balance text-muted-foreground">
                                        {description}
                                    </p>
                                ) : null}
                            </div>
                        ) : null}
                    </div>

                    {children}
                </div>
            </div>

            <footer className="pb-8 text-center text-[0.7rem] tracking-[0.25em] text-muted-foreground/70 uppercase">
                {name}
            </footer>
        </div>
    );
}
