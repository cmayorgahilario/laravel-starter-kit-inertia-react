import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

const STRIP_PLUGINS = new Set([
    'laravel-vite-plugin',
    'inertia',
    'wayfinder',
    'vite:react-compiler-babel',
    '@rolldown/plugin-babel',
]);

function shouldStrip(name: string | undefined): boolean {
    if (!name) return false;
    if (STRIP_PLUGINS.has(name)) return true;
    return (
        name.startsWith('vite-plugin-laravel') ||
        name.startsWith('inertia') ||
        name.startsWith('wayfinder')
    );
}

const config: StorybookConfig = {
    framework: '@storybook/react-vite',
    stories: ['../resources/js/stories/**/*.stories.@(ts|tsx)'],
    addons: ['@storybook/addon-docs', '@storybook/addon-themes'],
    typescript: {
        reactDocgen: 'react-docgen-typescript',
    },
    async viteFinal(cfg) {
        const flat = ((cfg.plugins ?? []) as unknown[]).flat(Infinity) as unknown[];
        cfg.plugins = flat.filter(
            (p) =>
                !!p && typeof p === 'object' && 'name' in p && !shouldStrip((p as { name?: string }).name),
        ) as typeof cfg.plugins;

        const mocksDir = resolve(__dirname, 'mocks');
        cfg.resolve = {
            ...cfg.resolve,
            alias: [
                { find: '@inertiajs/react', replacement: resolve(mocksDir, 'inertia-react.tsx') },
                { find: /^@\/routes$/, replacement: resolve(mocksDir, 'routes/index.ts') },
                { find: /^@\/routes\/(.*)$/, replacement: resolve(mocksDir, 'routes') + '/$1' },
                { find: /^@\/actions\/(.*)$/, replacement: resolve(mocksDir, 'actions') + '/$1' },
                { find: '@', replacement: resolve(__dirname, '../resources/js') },
            ],
        };
        return cfg;
    },
};

export default config;
