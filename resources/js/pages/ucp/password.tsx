import { Form, Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { toast } from 'sonner';

import { PasswordInput } from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import UcpLayout from '@/layouts/ucp-layout';
import { update } from '@/routes/user-password';

export default function UcpPassword() {
    return (
        <>
            <Head title="Password" />

            <Card>
                <CardHeader className="border-b">
                    <CardTitle>Password</CardTitle>
                    <CardDescription>Use a long, unique password to keep your account secure.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form
                        action={update.url()}
                        method="put"
                        errorBag="updatePassword"
                        resetOnSuccess={['current_password', 'password', 'password_confirmation']}
                        onSuccess={() => toast.success('Password updated.')}
                        className="flex flex-col gap-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <FieldGroup className="gap-5">
                                    <Field data-invalid={errors.current_password ? true : undefined}>
                                        <FieldLabel htmlFor="current_password">Current password</FieldLabel>
                                        <PasswordInput
                                            id="current_password"
                                            name="current_password"
                                            autoComplete="current-password"
                                            required
                                            aria-invalid={errors.current_password ? true : undefined}
                                        />
                                        {errors.current_password ? (
                                            <FieldError>{errors.current_password}</FieldError>
                                        ) : null}
                                    </Field>

                                    <Field data-invalid={errors.password ? true : undefined}>
                                        <FieldLabel htmlFor="password">New password</FieldLabel>
                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            autoComplete="new-password"
                                            required
                                            aria-invalid={errors.password ? true : undefined}
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
                                        />
                                        {errors.password_confirmation ? (
                                            <FieldError>{errors.password_confirmation}</FieldError>
                                        ) : null}
                                    </Field>
                                </FieldGroup>

                                <div className="flex justify-end">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? <Spinner data-icon="inline-start" /> : null}
                                        Update password
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </CardContent>
            </Card>
        </>
    );
}

UcpPassword.layout = (page: ReactNode) => (
    <AppLayout>
        <UcpLayout>{page}</UcpLayout>
    </AppLayout>
);
