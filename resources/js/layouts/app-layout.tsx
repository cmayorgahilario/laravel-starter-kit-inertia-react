import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import React from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <AppLayoutTemplate>
            {children}
        </AppLayoutTemplate>
    );
}
