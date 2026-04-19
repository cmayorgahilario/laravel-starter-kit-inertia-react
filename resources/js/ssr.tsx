import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { renderToString } from 'react-dom/server';
import React from "react";

createServer((page) =>
    createInertiaApp({
        page,
        render: renderToString,
        resolve: (name: string) => {
            const pages = import.meta.glob('./pages/**/*.tsx', { eager: true }) as Record<
                string,
                { default: React.ComponentType }
            >;
            return pages[`./pages/${name}.tsx`];
        },
        setup: ({ App, props }) => <App {...props} />,
    }),
);
