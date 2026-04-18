import { useForm, usePage } from '@inertiajs/react';
import { FormEvent } from 'react';
import SettingsLayout from '../../layouts/settings-layout';

interface NotificationsPageProps {
    preferences: Record<string, boolean>;
    status?: string;
}

export default function NotificationsPage() {
    const { flash } = usePage().props;
    const { preferences, status } = usePage<NotificationsPageProps>().props;

    const { data, setData, patch, processing, errors } = useForm({
        preferences: {
            email: preferences.email ?? true,
        } as Record<string, boolean>,
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        patch('/settings/notifications');
    }

    function togglePreference(key: string) {
        setData('preferences', {
            ...data.preferences,
            [key]: !data.preferences[key],
        });
    }

    return (
        <SettingsLayout title="Notifications">
            {(flash.status === 'notifications-updated' || status === 'notifications-updated') && (
                <div className="mb-6 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    Notification preferences saved.
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Email notifications
                    </h2>

                    <label className="flex cursor-pointer items-start gap-4 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50">
                        <div className="flex h-5 items-center">
                            <input
                                type="checkbox"
                                checked={data.preferences.email ?? true}
                                onChange={() => togglePreference('email')}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                            />
                        </div>
                        <div className="flex-1 leading-tight">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Email notifications</p>
                            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                Receive important account updates and security alerts via email.
                            </p>
                        </div>
                    </label>
                </div>

                {errors.preferences && (
                    <p className="text-xs text-red-600 dark:text-red-400">{errors.preferences}</p>
                )}

                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                >
                    {processing ? 'Saving…' : 'Save preferences'}
                </button>
            </form>
        </SettingsLayout>
    );
}
