import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';

export default function AppSidebarLayout({ children }: { children: ReactNode }) {
    const breadcrumbs = usePage<{ breadcrumbs?: BreadcrumbItem[] }>().props.breadcrumbs ?? [];

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
