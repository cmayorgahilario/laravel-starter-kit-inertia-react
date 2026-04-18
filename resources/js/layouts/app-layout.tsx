import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import React from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const breadcrumbs = usePage<{ breadcrumbs?: BreadcrumbItem[] }>().props.breadcrumbs ?? [];

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs}>
            {children}
        </AppLayoutTemplate>
    );
}
