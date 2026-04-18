import type { User } from './auth';

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
    }
}

export {};
