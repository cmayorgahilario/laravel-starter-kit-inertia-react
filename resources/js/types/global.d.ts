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
