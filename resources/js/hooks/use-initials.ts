import { useCallback } from 'react';

export type GetInitialsFn = (fullName: string) => string;

export function useInitials(): GetInitialsFn {
    return useCallback((fullName: string): string => {
        const names = fullName.trim().split(' ');
        const first = names[0] ?? '';

        if (names.length === 1) {
            return first.charAt(0).toUpperCase();
        }

        const last = names[names.length - 1] ?? '';

        return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    }, []);
}
