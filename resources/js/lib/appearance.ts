export type Appearance = 'light' | 'dark' | 'system' | '';

export function applyTheme(appearance: Appearance) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark =
        appearance === 'dark' ||
        (appearance !== 'light' && appearance !== '' && prefersDark) ||
        (appearance === '' && prefersDark);
    document.documentElement.classList.toggle('dark', isDark);
}

export function cycleAppearance(current: Appearance): Appearance {
    if (current === '' || current === 'system') return 'light';
    if (current === 'light') return 'dark';
    return 'system';
}

export function setAppearanceCookie(value: Appearance) {
    if (value === 'system' || value === '') {
        document.cookie = 'appearance=; path=/; max-age=0; SameSite=Lax';
    } else {
        document.cookie = `appearance=${value}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
    }
}

export const APPEARANCE_ICONS: Record<string, string> = {
    light: '☀️',
    dark: '🌙',
    system: '💻',
    '': '💻',
};
