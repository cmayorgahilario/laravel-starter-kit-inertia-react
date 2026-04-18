import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import AuthLayout from '../../layouts/auth-layout';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors } = useForm({
        password: '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post('/confirm-password');
    }

    return (
        <AuthLayout title="Confirm password">
            <p className="mb-5 text-sm text-gray-600 dark:text-gray-400">
                This is a secure area. Please confirm your password before continuing.
            </p>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                        required
                        autoComplete="current-password"
                        autoFocus
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
                    />
                    {errors.password && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password}</p>}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                >
                    {processing ? 'Confirming…' : 'Confirm'}
                </button>
            </form>
        </AuthLayout>
    );
}
