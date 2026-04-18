import { Head, usePage } from '@inertiajs/react';
import { ReactNode, useEffect, useState } from 'react';
import { APPEARANCE_ICONS, Appearance, applyTheme, cycleAppearance, setAppearanceCookie } from '../lib/appearance';

interface AuthLayoutProps {
    title: string;
    children: ReactNode;
}

export default function AuthLayout({ title, children }: AuthLayoutProps) {
    const { appearance: serverAppearance, app } = usePage().props;
    const [appearance, setAppearance] = useState<Appearance>(serverAppearance || '');

    useEffect(() => {
        applyTheme(appearance);
    }, [appearance]);

    function toggleTheme() {
        const next = cycleAppearance(appearance);
        setAppearanceCookie(next);
        setAppearance(next);
    }

    return (
        <>
            <Head title={`${title} — ${app.name}`} />
            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
                <div className="w-full max-w-md">
                    <div className="mb-8 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{app.name}</h1>
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                            title={`Theme: ${appearance || 'system'}`}
                            aria-label="Toggle theme"
                        >
                            {APPEARANCE_ICONS[appearance]}
                        </button>
                    </div>

                    <div className="rounded-xl bg-white px-8 py-10 shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
                        <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
