import type { InertiaLinkProps } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

import type { FlashToast } from '@/types/ui';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    avatar_url: string;
    two_factor_enabled: boolean;
    can_access_admin: boolean;
}

export interface Auth {
    user: User | null;
}

export interface Features {
    browserSessions: boolean;
}

export interface SharedData {
    name: string;
    auth: Auth;
    features: Features;
    flash: {
        toast: FlashToast | null;
    };
    [key: string]: unknown;
}

export interface Passkey {
    id: number;
    name: string;
    authenticator: string | null;
    created_at_diff: string | null;
    last_used_at_diff: string | null;
}

export interface SessionRecord {
    id: string;
    ip_address: string | null;
    is_current_device: boolean;
    last_active: string;
    browser: string;
    platform: string;
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon;
}
