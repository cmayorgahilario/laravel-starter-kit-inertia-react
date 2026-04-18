import { Head, Link, router, usePage } from '@inertiajs/react';
import { ReactNode, useEffect, useState } from 'react';
import { APPEARANCE_ICONS, Appearance, applyTheme, cycleAppearance, setAppearanceCookie } from '../lib/appearance';

interface SettingsLayoutProps {
    title: string;
    children: ReactNode;
}

const NAV_ITEMS = [
    { label: 'Profile', href: '/settings/profile' },
    { label: 'Password & Security', href: '/settings/password' },
    { label: 'Appearance', href: '/settings/appearance' },
    { label: 'Sessions', href: '/settings/sessions' },
    { label: 'Notifications', href: '/settings/notifications' },
];

export default function SettingsLayout({ title, children }: SettingsLayoutProps) {
    const { appearance: serverAppearance, app, auth } = usePage().props;
    const [appearance, setAppearance] = useState<Appearance>(serverAppearance || '');

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    useEffect(() => {
        applyTheme(appearance);
    }, [appearance]);

    function toggleTheme() {
        const next = cycleAppearance(appearance);
        setAppearanceCookie(next);
        setAppearance(next);
    }

    function logout() {
        router.post('/logout');
    }

    return (
        <>
            <Head title={`${title} — ${app.name}`} />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-6">
                            <Link
                                href="/dashboard"
                                className="text-xl font-semibold text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
                            >
                                {app.name}
                            </Link>
                            <span className="text-gray-400 dark:text-gray-500">/</span>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Settings</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={toggleTheme}
                                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                                title={`Theme: ${appearance || 'system'}`}
                                aria-label="Toggle theme"
                            >
                                {APPEARANCE_ICONS[appearance]}
                            </button>
                            <span className="text-sm text-gray-600 dark:text-gray-400">{auth.user?.name}</span>
                            <button
                                type="button"
                                onClick={logout}
                                className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            >
                                Log out
                            </button>
                        </div>
                    </div>
                </header>

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex gap-8">
                        <nav className="w-48 shrink-0">
                            <ul className="space-y-1">
                                {NAV_ITEMS.map(item => {
                                    const isActive = currentPath === item.href || currentPath.startsWith(item.href);
                                    return (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                                    isActive
                                                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                                                }`}
                                            >
                                                {item.label}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>

                        <main className="min-w-0 flex-1">
                            <div className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
                                <h1 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">{title}</h1>
                                {children}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}
