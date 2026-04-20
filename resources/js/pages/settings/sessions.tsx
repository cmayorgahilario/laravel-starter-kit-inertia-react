import type { PageProps } from '@inertiajs/core';
import { Head, useForm, usePage } from '@inertiajs/react';
import { SubmitEvent, useState } from 'react';
import Heading from '@/components/heading';
import type { SessionData } from '@/types/session';

interface SessionsPageProps extends PageProps {
    sessions: SessionData[];
    status?: string;
}

export default function Sessions() {
    const { flash } = usePage().props;
    const { sessions, status } = usePage<SessionsPageProps>().props;
    const [showConfirm, setShowConfirm] = useState(false);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm({
        password: '',
    });

    function submit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        destroy('/settings/sessions', {
            onSuccess: () => {
                reset();
                setShowConfirm(false);
            },
        });
    }

    function formatUserAgent(ua: string): string {
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        return ua.length > 40 ? ua.substring(0, 40) + '…' : ua;
    }

    return (
        <>
            <Head title="Session settings" />

            <h1 className="sr-only">Session settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Active sessions"
                    description="Review devices signed in to your account and log out other sessions"
                />

                {(flash.status === 'sessions-terminated' ||
                    status === 'sessions-terminated') && (
                    <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Other sessions have been logged out.
                    </div>
                )}

                <div className="space-y-3">
                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            className="flex items-start justify-between rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700"
                        >
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {formatUserAgent(session.user_agent)}
                                    </span>
                                    {session.is_current && (
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                            This device
                                        </span>
                                    )}
                                </div>
                                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                    {session.ip_address} · Last active{' '}
                                    {session.last_activity}
                                </p>
                            </div>
                        </div>
                    ))}

                    {sessions.length === 0 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            No active sessions found.
                        </p>
                    )}
                </div>

                <div>
                    {!showConfirm ? (
                        <button
                            type="button"
                            onClick={() => setShowConfirm(true)}
                            className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                            Log out other sessions
                        </button>
                    ) : (
                        <form onSubmit={submit} className="space-y-4">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Enter your password to log out all other
                                sessions.
                            </p>
                            <div>
                                <label
                                    htmlFor="session-password"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Password
                                </label>
                                <input
                                    id="session-password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    required
                                    autoComplete="current-password"
                                    autoFocus
                                    className="mt-1 block w-full max-w-sm rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
                                />
                                {errors.password && (
                                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                        {errors.password}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                                >
                                    {processing
                                        ? 'Logging out…'
                                        : 'Log out other sessions'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        reset();
                                        setShowConfirm(false);
                                    }}
                                    className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
}
