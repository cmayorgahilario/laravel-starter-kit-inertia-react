import { defineConfig } from 'vite-plus';
import laravel from 'laravel-vite-plugin';
import inertia from '@inertiajs/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import babel from '@rolldown/plugin-babel';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        inertia(),
        react(),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
        babel({ presets: [reactCompilerPreset()] }),
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
    lint: {
        plugins: ['typescript', 'react', 'unicorn', 'import'],
    },
    fmt: {
        singleQuote: true,
        tabWidth: 4,
        sortImports: true,
        sortTailwindcss: {
            functions: ['cn', 'cva'],
        },
        ignorePatterns: ['resources/js/components/ui/**'],
    },
});
