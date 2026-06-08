import type { PropsWithChildren } from 'react';

import { AppHeader } from '@/components/app-header';

export default function AppLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-svh flex-col bg-background">
            <AppHeader />
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">{children}</main>
        </div>
    );
}
