export interface SessionData {
    id: string;
    ip_address: string;
    user_agent: string;
    last_activity: string;
    is_current: boolean;
}

export interface NotificationPreferences {
    email: boolean;
    [key: string]: boolean;
}

declare module '@inertiajs/core' {
    interface PageProps {
        auth: {
            user: {
                id: number;
                avatar?: string;
                name: string;
                email: string;
                email_verified_at: string | null;
                two_factor_confirmed_at: string | null;
                created_at: string;
                updated_at: string;
                [key: string]: unknown;
            } | null;
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
