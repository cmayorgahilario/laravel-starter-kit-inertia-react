import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import React from "react";

void createInertiaApp({
    resolve: (name: string) => {
        const pages = import.meta.glob('./pages/**/*.tsx', { eager: true }) as Record<
            string,
            { default: React.ComponentType }
        >;
        return pages[`./pages/${name}.tsx`];
    },
    setup({ el, App, props }: { el: HTMLElement; App: React.FC<Record<string, unknown>>; props: Record<string, unknown> }) {
        createRoot(el).render(<App {...props} />);
    },
});
