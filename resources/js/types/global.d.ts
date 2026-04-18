import type { PageProps as InertiaPageProps } from '@inertiajs/react';

declare module '@inertiajs/react' {
    interface PageProps extends InertiaPageProps {
        auth: {
            user: {
                id: number;
                name: string;
                email: string;
            } | null;
        };
        app: {
            name: string;
        };
    }
}
