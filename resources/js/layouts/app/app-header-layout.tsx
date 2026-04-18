import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import type { BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';

export default function AppHeaderLayout({ children }: { children: ReactNode }) {
    const breadcrumbs = usePage<{ breadcrumbs?: BreadcrumbItem[] }>().props.breadcrumbs ?? [];

    return (
        <AppShell variant="header">
            <AppHeader breadcrumbs={breadcrumbs} />
            <AppContent variant="header">{children}</AppContent>
        </AppShell>
    );
}
