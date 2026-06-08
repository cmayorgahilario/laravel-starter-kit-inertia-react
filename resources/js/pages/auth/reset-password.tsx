import { Form, Head } from '@inertiajs/react';
import type { ReactNode } from 'react';

import { PasswordInput } from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { update } from '@/routes/password';

interface ResetPasswordProps {
    email: string;
    token: string;
}

export default function ResetPassword({ email, token }: ResetPasswordProps) {
    return (
        <>
            <Head title="Reset password" />

            <Form
                action={update.url()}
                method="post"
                resetOnSuccess={['password', 'password_confirmation']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <input type="hidden" name="token" defaultValue={token} />

                        <FieldGroup className="gap-5">
                            <Field data-invalid={errors.email ? true : undefined}>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    defaultValue={email}
                                    readOnly
                                    aria-invalid={errors.email ? true : undefined}
                                    className="text-muted-foreground"
                                />
                                {errors.email ? <FieldError>{errors.email}</FieldError> : null}
                            </Field>

                            <Field data-invalid={errors.password ? true : undefined}>
                                <FieldLabel htmlFor="password">New password</FieldLabel>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    autoComplete="new-password"
                                    required
                                    autoFocus
                                    aria-invalid={errors.password ? true : undefined}
                                    placeholder="••••••••"
                                />
                                {errors.password ? <FieldError>{errors.password}</FieldError> : null}
                            </Field>

                            <Field data-invalid={errors.password_confirmation ? true : undefined}>
                                <FieldLabel htmlFor="password_confirmation">Confirm password</FieldLabel>
                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    autoComplete="new-password"
                                    required
                                    aria-invalid={errors.password_confirmation ? true : undefined}
                                    placeholder="••••••••"
                                />
                                {errors.password_confirmation ? (
                                    <FieldError>{errors.password_confirmation}</FieldError>
                                ) : null}
                            </Field>
                        </FieldGroup>

                        <Button type="submit" size="lg" className="w-full" disabled={processing}>
                            {processing ? <Spinner data-icon="inline-start" /> : null}
                            Reset password
                        </Button>
                    </>
                )}
            </Form>
        </>
    );
}

ResetPassword.layout = (page: ReactNode) => (
    <AuthLayout title="New password" description="Choose a secure password for your account.">
        {page}
    </AuthLayout>
);
