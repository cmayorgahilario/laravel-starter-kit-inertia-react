import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { hydrateRoot } from 'react-dom/client';

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.tsx', { eager: true }) as Record<
            string,
            { default: React.ComponentType }
        >;
        return pages[`./pages/${name}.tsx`];
    },
    setup({ el, App, props }) {
        hydrateRoot(el, <App {...props} />);
    },
});
