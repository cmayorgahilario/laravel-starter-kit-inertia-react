import { useForm, usePage } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import SettingsLayout from '../../layouts/settings-layout';

interface ProfilePageProps {
    mustVerifyEmail: boolean;
    status?: string;
}

export default function ProfilePage() {
    const { auth, flash } = usePage().props;
    const { mustVerifyEmail, status } = usePage<ProfilePageProps>().props;
    const user = auth.user!;

    const profileForm = useForm({
        name: user.name,
        email: user.email,
    });

    const deleteForm = useForm({
        password: '',
    });

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    function submitProfile(e: FormEvent) {
        e.preventDefault();
        profileForm.patch('/settings/profile');
    }

    function submitDelete(e: FormEvent) {
        e.preventDefault();
        deleteForm.delete('/settings/profile', {
            onSuccess: () => setShowDeleteConfirm(false),
        });
    }

    return (
        <SettingsLayout title="Profile">
            {(flash.status === 'profile-updated' || status === 'profile-updated') && (
                <div className="mb-6 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    Profile updated successfully.
                </div>
            )}

            <form onSubmit={submitProfile} className="space-y-5">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={profileForm.data.name}
                        onChange={e => profileForm.setData('name', e.target.value)}
                        required
                        autoComplete="name"
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
                    />
                    {profileForm.errors.name && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{profileForm.errors.name}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={profileForm.data.email}
                        onChange={e => profileForm.setData('email', e.target.value)}
                        required
                        autoComplete="email"
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
                    />
                    {profileForm.errors.email && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{profileForm.errors.email}</p>
                    )}
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                        Your email is unverified.{' '}
                        <a href="/email/verification-notification" className="underline hover:no-underline">
                            Resend verification email.
                        </a>
                    </p>
                )}

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={profileForm.processing}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                    >
                        {profileForm.processing ? 'Saving…' : 'Save changes'}
                    </button>
                </div>
            </form>

            <hr className="my-8 border-gray-200 dark:border-gray-700" />

            <div>
                <h2 className="text-base font-semibold text-red-600 dark:text-red-400">Delete account</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Once your account is deleted, all data will be permanently removed.
                </p>

                {!showDeleteConfirm ? (
                    <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="mt-4 rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                        Delete account
                    </button>
                ) : (
                    <form onSubmit={submitDelete} className="mt-4 space-y-4">
                        <div>
                            <label htmlFor="delete-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Confirm your password
                            </label>
                            <input
                                id="delete-password"
                                type="password"
                                value={deleteForm.data.password}
                                onChange={e => deleteForm.setData('password', e.target.value)}
                                required
                                autoComplete="current-password"
                                autoFocus
                                className="mt-1 block w-full max-w-sm rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
                            />
                            {deleteForm.errors.password && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{deleteForm.errors.password}</p>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="submit"
                                disabled={deleteForm.processing}
                                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                {deleteForm.processing ? 'Deleting…' : 'Permanently delete'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(false)}
                                className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </SettingsLayout>
    );
}
