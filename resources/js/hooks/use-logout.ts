import { router } from '@inertiajs/react';

import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';

export function useLogout(): () => void {
    const cleanup = useMobileNavigation();

    return () => {
        cleanup();
        router.flushAll();
        router.post(logout.url());
    };
}
