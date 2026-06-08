import { useSyncExternalStore } from 'react';

export const MOBILE_BREAKPOINT = 768;

const mql = typeof window === 'undefined' ? undefined : window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

function mediaQueryListener(callback: (event: MediaQueryListEvent) => void) {
    if (!mql) {
        return () => {
            // SSR / sin matchMedia: nada que limpiar.
        };
    }

    mql.addEventListener('change', callback);

    return () => {
        mql.removeEventListener('change', callback);
    };
}

function isSmallerThanBreakpoint(): boolean {
    return mql?.matches ?? false;
}

function getServerSnapshot(): boolean {
    return false;
}

export function useIsMobile(): boolean {
    return useSyncExternalStore(mediaQueryListener, isSmallerThanBreakpoint, getServerSnapshot);
}
