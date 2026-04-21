import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const STRIP_PLUGINS = new Set([
    'laravel-vite-plugin',
    'inertia',
    'wayfinder',
    'vite:react-compiler-babel',
    'babel',
]);

function shouldStrip(name: string | undefined): boolean {
    if (!name) return false;
    if (STRIP_PLUGINS.has(name)) return true;
    if (
        name.startsWith('vite-plugin-laravel') ||
        name.startsWith('inertia') ||
        name.startsWith('wayfinder') ||
        name.includes('rolldown')
    )
        return true;
    return false;
}

const config: StorybookConfig = {
    framework: '@storybook/react-vite',
    stories: ['../resources/js/stories/**/*.stories.@(ts|tsx)'],
    addons: ['@storybook/addon-essentials', '@storybook/addon-themes'],
    typescript: {
        reactDocgen: 'react-docgen-typescript',
    },
    async viteFinal(cfg) {
        const flat = (cfg.plugins ?? []).flat();
        console.log(
            '[storybook viteFinal] plugins:',
            flat.map((p) => (p && 'name' in p ? p.name : p)),
        );
        return mergeConfig(cfg, {
            plugins: flat.filter(
                (p): p is NonNullable<typeof p> =>
                    !!p && 'name' in p && !shouldStrip((p as { name?: string }).name),
            ),
        });
    },
};

export default config;
