import { useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import AuthLayout from '../../layouts/auth-layout';

type Mode = 'code' | 'recovery';

export default function TwoFactorChallenge() {
    const [mode, setMode] = useState<Mode>('code');
    const { data, setData, post, processing, errors, reset } = useForm({
        code: '',
        recovery_code: '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post('/two-factor-challenge');
    }

    function toggleMode() {
        reset();
        setMode(mode === 'code' ? 'recovery' : 'code');
    }

    return (
        <AuthLayout title="Two-factor authentication">
            <p className="mb-5 text-sm text-gray-600 dark:text-gray-400">
                {mode === 'code'
                    ? 'Please confirm access to your account by entering the authentication code provided by your authenticator application.'
                    : 'Please confirm access to your account by entering one of your emergency recovery codes.'}
            </p>

            <form onSubmit={submit} className="space-y-5">
                {mode === 'code' ? (
                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Authentication code
                        </label>
                        <input
                            id="code"
                            type="text"
                            name="code"
                            value={data.code}
                            onChange={e => setData('code', e.target.value)}
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={6}
                            autoFocus
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
                        />
                        {errors.code && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.code}</p>}
                    </div>
                ) : (
                    <div>
                        <label htmlFor="recovery_code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Recovery code
                        </label>
                        <input
                            id="recovery_code"
                            type="text"
                            name="recovery_code"
                            value={data.recovery_code}
                            onChange={e => setData('recovery_code', e.target.value)}
                            autoComplete="off"
                            autoFocus
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
                        />
                        {errors.recovery_code && (
                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.recovery_code}</p>
                        )}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                >
                    {processing ? 'Logging in…' : 'Log in'}
                </button>
            </form>

            <div className="mt-4 text-center">
                <button
                    type="button"
                    onClick={toggleMode}
                    className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                    {mode === 'code' ? 'Use a recovery code' : 'Use an authentication code'}
                </button>
            </div>
        </AuthLayout>
    );
}
