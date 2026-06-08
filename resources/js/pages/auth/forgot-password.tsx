import { Form, Head } from '@inertiajs/react';
import type { ReactNode } from 'react';

import { TextLink } from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { email } from '@/routes/password';

interface ForgotPasswordProps {
    status?: string;
}

export default function ForgotPassword({ status }: ForgotPasswordProps) {
    return (
        <>
            <Head title="Forgot password" />

            {status ? (
                <div className="border border-border bg-muted/50 px-4 py-3 text-center text-sm text-muted-foreground">
                    {status}
                </div>
            ) : null}

            <Form action={email.url()} method="post" className="flex flex-col gap-6">
                {({ processing, errors }) => (
                    <>
                        <FieldGroup>
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
                        </FieldGroup>

                        <Button type="submit" size="lg" className="w-full" disabled={processing}>
                            {processing ? <Spinner data-icon="inline-start" /> : null}
                            Send reset link
                        </Button>
                    </>
                )}
            </Form>

            <p className="text-center text-sm text-muted-foreground">
                <TextLink href={login()}>Back to sign in</TextLink>
            </p>
        </>
    );
}

ForgotPassword.layout = (page: ReactNode) => (
    <AuthLayout title="Recover your access" description="We'll send you a link to reset your password.">
        {page}
    </AuthLayout>
);
