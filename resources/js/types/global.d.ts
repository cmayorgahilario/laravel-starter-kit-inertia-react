declare module '@inertiajs/core' {
    interface PageProps {
        auth: {
            user: {
                id: number;
                name: string;
                email: string;
                email_verified_at: string | null;
            } | null;
        };
        app: {
            name: string;
        };
        appearance: 'light' | 'dark' | 'system' | '';
        flash: {
            status?: string;
        };
    }
}
