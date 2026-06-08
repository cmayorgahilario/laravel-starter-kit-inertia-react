import { Form, Head, router } from '@inertiajs/react';
import { usePasskeyVerify } from '@laravel/passkeys/react';
import { KeyRoundIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { store } from '@/actions/Laravel/Fortify/Http/Controllers/ConfirmablePasswordController';
import {
    index as passkeyConfirmOptions,
    store as passkeyConfirmStore,
} from '@/actions/Laravel/Passkeys/Http/Controllers/PasskeyConfirmationController';
import { PasswordInput } from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { dashboard } from '@/routes';

export default function ConfirmPassword() {
    // The backend returns the intended URL after confirming via passkey, mirroring
    // Fortify's `redirect()->intended()` used by the password form below.
    const { verify, isLoading, error, isSupported } = usePasskeyVerify({
        routes: { options: passkeyConfirmOptions.url(), submit: passkeyConfirmStore.url() },
        onSuccess: (response) => router.visit(response.redirect ?? dashboard.url()),
    });

    return (
        <>
            <Head title="Confirm password" />

            <Form action={store.url()} method="post" resetOnSuccess={['password']} className="flex flex-col gap-6">
                {({ processing, errors }) => (
                    <>
                        <FieldGroup>
                            <Field data-invalid={errors.password ? true : undefined}>
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    autoComplete="current-password"
                                    required
                                    autoFocus
                                    aria-invalid={errors.password ? true : undefined}
                                    placeholder="••••••••"
                                />
                                {errors.password ? <FieldError>{errors.password}</FieldError> : null}
                            </Field>
                        </FieldGroup>

                        <Button type="submit" size="lg" className="w-full" disabled={processing}>
                            {processing ? <Spinner data-icon="inline-start" /> : null}
                            Confirm
                        </Button>
                    </>
                )}
            </Form>

            {isSupported ? (
                <>
                    <div className="relative flex items-center justify-center">
                        <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
                        <span className="relative bg-card px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            or
                        </span>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            className="w-full"
                            onClick={() => void verify()}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Spinner data-icon="inline-start" />
                            ) : (
                                <KeyRoundIcon data-icon="inline-start" />
                            )}
                            Confirm with passkey
                        </Button>
                        {error ? <FieldError className="text-center">{error}</FieldError> : null}
                    </div>
                </>
            ) : null}
        </>
    );
}

ConfirmPassword.layout = (page: ReactNode) => (
    <AuthLayout
        title="Confirm your password"
        description="This is a secure area. Re-enter your password or use a passkey to continue."
    >
        {page}
    </AuthLayout>
);
