import { Form, Head, usePage } from '@inertiajs/react';
import type { PropsWithChildren, ReactNode } from 'react';

import { PasswordInput } from '@/components/password-input';
import { TextLink } from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { store } from '@/routes/register';
import type { SharedData } from '@/types';

export default function Register() {
    return (
        <>
            <Head title="Create account" />

            <Form
                action={store.url()}
                method="post"
                resetOnSuccess={['password', 'password_confirmation']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <FieldGroup className="gap-5">
                            <Field data-invalid={errors.name ? true : undefined}>
                                <FieldLabel htmlFor="name">Full name</FieldLabel>
                                <Input
                                    id="name"
                                    name="name"
                                    autoComplete="name"
                                    required
                                    autoFocus
                                    aria-invalid={errors.name ? true : undefined}
                                    placeholder="Ada Lovelace"
                                />
                                {errors.name ? <FieldError>{errors.name}</FieldError> : null}
                            </Field>

                            <Field data-invalid={errors.email ? true : undefined}>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    aria-invalid={errors.email ? true : undefined}
                                    placeholder="you@email.com"
                                />
                                {errors.email ? <FieldError>{errors.email}</FieldError> : null}
                            </Field>

                            <Field data-invalid={errors.password ? true : undefined}>
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    autoComplete="new-password"
                                    required
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
                            Create account
                        </Button>
                    </>
                )}
            </Form>

            <p className="text-center text-sm text-muted-foreground">
                Already have an account? <TextLink href={login()}>Sign in</TextLink>
            </p>
        </>
    );
}

function RegisterLayout({ children }: PropsWithChildren) {
    const { name } = usePage<SharedData>().props;

    return (
        <AuthLayout title="Create your account" description={`Set up your ${name} access in less than a minute.`}>
            {children}
        </AuthLayout>
    );
}

Register.layout = (page: ReactNode) => <RegisterLayout>{page}</RegisterLayout>;
