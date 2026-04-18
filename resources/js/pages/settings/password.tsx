import { router, useForm, usePage } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import SettingsLayout from '../../layouts/settings-layout';

interface PasswordPageProps {
    status?: string;
}

export default function PasswordPage() {
    const { flash } = usePage().props;
    const { status } = usePage<PasswordPageProps>().props;
    const { auth } = usePage().props;
    const twoFactorConfirmedAt = auth.user?.two_factor_confirmed_at ?? null;

    const { data, setData, put, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // 2FA state
    const [showSetup, setShowSetup] = useState(false);
    const [qrSvg, setQrSvg] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
    const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);
    const [confirmCode, setConfirmCode] = useState('');
    const [confirmError, setConfirmError] = useState('');
    const [enabling, setEnabling] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [disabling, setDisabling] = useState(false);
    const [copied, setCopied] = useState(false);

    function submit(e: FormEvent) {
        e.preventDefault();
        put('/settings/password', {
            onSuccess: () => reset(),
        });
    }

    async function fetchQrAndSecret() {
        const [qrRes, secretRes] = await Promise.all([
            fetch('/user/two-factor-qr-code', { headers: { Accept: 'application/json' }, credentials: 'same-origin' }),
            fetch('/user/two-factor-secret-key', { headers: { Accept: 'application/json' }, credentials: 'same-origin' }),
        ]);
        const qrData = await qrRes.json();
        const secretData = await secretRes.json();
        setQrSvg(qrData.svg ?? '');
        setSecretKey(secretData.secretKey ?? '');
    }

    async function fetchRecoveryCodes() {
        const res = await fetch('/user/two-factor-recovery-codes', {
            headers: { Accept: 'application/json' },
            credentials: 'same-origin',
        });
        const codes: string[] = await res.json();
        setRecoveryCodes(codes);
    }

    function enableTwoFactor() {
        setEnabling(true);
        router.post(
            '/user/two-factor-authentication',
            {},
            {
                preserveScroll: true,
                onSuccess: async () => {
                    await fetchQrAndSecret();
                    setShowSetup(true);
                    setEnabling(false);
                },
                onError: () => setEnabling(false),
            },
        );
    }

    function confirmTwoFactor() {
        setConfirming(true);
        setConfirmError('');
        router.post(
            '/user/confirmed-two-factor-authentication',
            { code: confirmCode },
            {
                preserveScroll: true,
                onSuccess: async () => {
                    await fetchRecoveryCodes();
                    setShowRecoveryCodes(true);
                    setShowSetup(false);
                    setConfirmCode('');
                    setConfirming(false);
                },
                onError: (errs) => {
                    setConfirmError(errs.code ?? 'Invalid code. Please try again.');
                    setConfirming(false);
                },
            },
        );
    }

    function disableTwoFactor() {
        setDisabling(true);
        router.delete('/user/two-factor-authentication', {
            preserveScroll: true,
            onSuccess: () => {
                setShowSetup(false);
                setShowRecoveryCodes(false);
                setQrSvg('');
                setSecretKey('');
                setRecoveryCodes([]);
                setConfirmCode('');
                setConfirmError('');
                setDisabling(false);
            },
            onError: () => setDisabling(false),
        });
    }

    function regenerateRecoveryCodes() {
        router.post(
            '/user/two-factor-recovery-codes',
            {},
            {
                preserveScroll: true,
                onSuccess: async () => {
                    await fetchRecoveryCodes();
                    setShowRecoveryCodes(true);
                },
            },
        );
    }

    function showExistingRecoveryCodes() {
        fetchRecoveryCodes().then(() => setShowRecoveryCodes(true));
    }

    function copyRecoveryCodes() {
        navigator.clipboard.writeText(recoveryCodes.join('\n')).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }

    const twoFactorEnabled = twoFactorConfirmedAt !== null;

    return (
        <SettingsLayout title="Password &amp; Security">
            {/* Password flash */}
            {(flash.status === 'password-updated' || status === 'password-updated') && (
                <div className="mb-6 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    Password updated successfully.
                </div>
            )}

            {/* 2FA flash banners */}
            {flash.status === 'two-factor-authentication-enabled' && (
                <div className="mb-6 rounded-md bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    Two-factor authentication has been enabled. Please confirm with your authenticator app.
                </div>
            )}
            {flash.status === 'two-factor-authentication-confirmed' && (
                <div className="mb-6 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    Two-factor authentication confirmed.
                </div>
            )}
            {flash.status === 'two-factor-authentication-disabled' && (
                <div className="mb-6 rounded-md bg-yellow-50 px-4 py-3 text-sm text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                    Two-factor authentication has been disabled.
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Current password
                    </label>
                    <input
                        id="current_password"
                        type="password"
                        value={data.current_password}
                        onChange={e => setData('current_password', e.target.value)}
                        required
                        autoComplete="current-password"
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
                    />
                    {errors.current_password && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.current_password}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        New password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                        required
                        autoComplete="new-password"
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
                    />
                    {errors.password && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Confirm new password
                    </label>
                    <input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={e => setData('password_confirmation', e.target.value)}
                        required
                        autoComplete="new-password"
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
                    />
                    {errors.password_confirmation && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password_confirmation}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                >
                    {processing ? 'Saving…' : 'Update password'}
                </button>
            </form>

            {/* Two-Factor Authentication section */}
            <hr className="my-8 border-gray-200 dark:border-gray-700" />

            <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Add an extra layer of security to your account using a TOTP authenticator app.
                </p>

                {/* Not enabled, no setup in progress */}
                {!twoFactorEnabled && !showSetup && !showRecoveryCodes && (
                    <button
                        type="button"
                        onClick={enableTwoFactor}
                        disabled={enabling}
                        className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                    >
                        {enabling ? 'Enabling…' : 'Enable 2FA'}
                    </button>
                )}

                {/* Setup flow: QR code + confirmation */}
                {showSetup && (
                    <div className="mt-4 space-y-5">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Scan this QR code with your authenticator app (e.g., Google Authenticator, Authy), then enter the 6-digit code below to confirm.
                        </p>

                        {qrSvg && (
                            <div
                                className="inline-block rounded-lg bg-white p-3 shadow"
                                dangerouslySetInnerHTML={{ __html: qrSvg }}
                            />
                        )}

                        {secretKey && (
                            <div>
                                <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                                    Or enter this key manually:
                                </p>
                                <code className="rounded-md bg-gray-100 px-3 py-1.5 font-mono text-sm tracking-widest text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                                    {secretKey}
                                </code>
                            </div>
                        )}

                        <div>
                            <label htmlFor="confirm_code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Confirmation code
                            </label>
                            <input
                                id="confirm_code"
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={6}
                                value={confirmCode}
                                onChange={e => setConfirmCode(e.target.value.replace(/\D/g, ''))}
                                placeholder="000000"
                                className="mt-1 block w-40 rounded-md border border-gray-300 bg-white px-3 py-2 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
                            />
                            {confirmError && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{confirmError}</p>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={confirmTwoFactor}
                                disabled={confirming || confirmCode.length < 6}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                            >
                                {confirming ? 'Confirming…' : 'Confirm'}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setShowSetup(false); setConfirmCode(''); setConfirmError(''); }}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Recovery codes display (post-confirm or requested) */}
                {showRecoveryCodes && recoveryCodes.length > 0 && (
                    <div className="mt-4 space-y-4">
                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                            <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
                                Save your recovery codes
                            </p>
                            <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
                                Each code can only be used once. Store them somewhere safe — you will need one if you lose access to your authenticator app.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                            {recoveryCodes.map(code => (
                                <code key={code} className="font-mono text-sm tracking-widest text-gray-800 dark:text-gray-200">
                                    {code}
                                </code>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={copyRecoveryCodes}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            >
                                {copied ? 'Copied!' : 'Copy codes'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowRecoveryCodes(false)}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                )}

                {/* Enabled state: status + management actions */}
                {twoFactorEnabled && !showSetup && !showRecoveryCodes && (
                    <div className="mt-4 space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                Enabled
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Your account is protected with two-factor authentication.
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={showExistingRecoveryCodes}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            >
                                Show recovery codes
                            </button>
                            <button
                                type="button"
                                onClick={regenerateRecoveryCodes}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            >
                                Regenerate recovery codes
                            </button>
                            <button
                                type="button"
                                onClick={disableTwoFactor}
                                disabled={disabling}
                                className="rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 dark:border-red-700 dark:bg-gray-700 dark:text-red-400 dark:hover:bg-gray-600"
                            >
                                {disabling ? 'Disabling…' : 'Disable 2FA'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </SettingsLayout>
    );
}
