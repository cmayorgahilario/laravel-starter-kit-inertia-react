import type { User } from './auth';
import type { BreadcrumbItem } from './navigation';

declare module '@inertiajs/core' {
    interface PageProps {
        auth: {
            user: User | null;
        };
        app: {
            name: string;
        };
        appearance: 'light' | 'dark' | 'system' | '';
        flash: {
            status?: string;
        };
        sidebarOpen: boolean;
        breadcrumbs?: BreadcrumbItem[];
    }
}

export {};
