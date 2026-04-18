import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEvent } from 'react';
import AuthLayout from '../../layouts/auth-layout';

export default function VerifyEmail() {
    const { flash, auth } = usePage().props;
    const { post, processing } = useForm({});

    function resend(e: FormEvent) {
        e.preventDefault();
        post('/email/verification-notification');
    }

    return (
        <AuthLayout title="Verify your email">
            <p className="mb-5 text-sm text-gray-600 dark:text-gray-400">
                Thanks for signing up! Before getting started, please verify your email address by clicking the link we
                just sent to <strong className="text-gray-800 dark:text-gray-200">{auth.user?.email}</strong>.
            </p>

            {flash.status === 'verification-link-sent' && (
                <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    A new verification link has been sent to your email address.
                </div>
            )}

            <form onSubmit={resend}>
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                >
                    {processing ? 'Sending…' : 'Resend verification email'}
                </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                    Log out
                </Link>
            </p>
        </AuthLayout>
    );
}
