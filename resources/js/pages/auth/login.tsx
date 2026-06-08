import { Form, Head, router } from '@inertiajs/react';
import { usePasskeyVerify } from '@laravel/passkeys/react';
import { KeyRoundIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { PasswordInput } from '@/components/password-input';
import { TextLink } from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { dashboard, register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

interface LoginProps {
    canResetPassword: boolean;
    status?: string;
}

export default function Login({ canResetPassword, status }: LoginProps) {
    const {
        verify,
        isLoading: passkeyLoading,
        error: passkeyError,
        isSupported: passkeySupported,
    } = usePasskeyVerify({
        onSuccess: (response) => router.visit(response.redirect ?? dashboard.url()),
    });

    return (
        <>
            <Head title="Sign in" />

            {status ? (
                <div className="border border-border bg-muted/50 px-4 py-3 text-center text-sm text-muted-foreground">
                    {status}
                </div>
            ) : null}

            <Form action={store.url()} method="post" resetOnSuccess={['password']} className="flex flex-col gap-6">
                {({ processing, errors }) => (
                    <>
                        <FieldGroup className="gap-5">
                            <Field data-invalid={errors.email ? true : undefined}>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    autoFocus
                                    aria-invalid={errors.email ? true : undefined}
                                    placeholder="you@email.com"
                                />
                                {errors.email ? <FieldError>{errors.email}</FieldError> : null}
                            </Field>

                            <Field data-invalid={errors.password ? true : undefined}>
                                <div className="flex items-center justify-between gap-3">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    {canResetPassword ? (
                                        <TextLink
                                            href={request()}
                                            className="text-[0.7rem] font-semibold tracking-wider text-muted-foreground uppercase no-underline hover:text-foreground"
                                        >
                                            Forgot your password?
                                        </TextLink>
                                    ) : null}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    autoComplete="current-password"
                                    required
                                    aria-invalid={errors.password ? true : undefined}
                                    placeholder="••••••••"
                                />
                                {errors.password ? <FieldError>{errors.password}</FieldError> : null}
                            </Field>

                            <Field orientation="horizontal" className="gap-2.5">
                                <Checkbox id="remember" name="remember" />
                                <FieldLabel htmlFor="remember">Keep me signed in</FieldLabel>
                            </Field>
                        </FieldGroup>

                        <Button type="submit" size="lg" className="w-full" disabled={processing}>
                            {processing ? <Spinner data-icon="inline-start" /> : null}
                            Sign in
                        </Button>
                    </>
                )}
            </Form>

            {passkeySupported ? (
                <div className="flex flex-col gap-4">
                    <div className="relative flex items-center justify-center">
                        <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
                        <span className="relative bg-card px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            or
                        </span>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="w-full"
                        onClick={() => void verify()}
                        disabled={passkeyLoading}
                    >
                        {passkeyLoading ? (
                            <Spinner data-icon="inline-start" />
                        ) : (
                            <KeyRoundIcon data-icon="inline-start" />
                        )}
                        Sign in with passkey
                    </Button>
                    {passkeyError ? <FieldError className="text-center">{passkeyError}</FieldError> : null}
                </div>
            ) : null}

            <p className="text-center text-sm text-muted-foreground">
                Don't have an account yet? <TextLink href={register()}>Create one</TextLink>
            </p>
        </>
    );
}

Login.layout = (page: ReactNode) => (
    <AuthLayout title="Welcome back" description="Enter your details to access your account.">
        {page}
    </AuthLayout>
);
