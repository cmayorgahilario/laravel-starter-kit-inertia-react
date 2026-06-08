import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import type { ReactNode } from 'react';

import { store } from '@/actions/Laravel/Fortify/Http/Controllers/TwoFactorAuthenticatedSessionController';
import { Button } from '@/components/ui/button';
import { Field, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';

export default function TwoFactorChallenge() {
    const [showRecovery, setShowRecovery] = useState(false);

    return (
        <>
            <Head title="Two-factor authentication" />

            <Form action={store.url()} method="post" className="flex flex-col gap-6">
                {({ processing, errors }) => (
                    <>
                        {showRecovery ? (
                            <Field data-invalid={errors.recovery_code ? true : undefined}>
                                <Input
                                    name="recovery_code"
                                    autoComplete="one-time-code"
                                    autoFocus
                                    required
                                    aria-invalid={errors.recovery_code ? true : undefined}
                                    placeholder="Recovery code"
                                />
                                {errors.recovery_code ? <FieldError>{errors.recovery_code}</FieldError> : null}
                            </Field>
                        ) : (
                            <Field data-invalid={errors.code ? true : undefined} className="items-center">
                                <InputOTP
                                    name="code"
                                    maxLength={6}
                                    autoComplete="one-time-code"
                                    autoFocus
                                    containerClassName="justify-center"
                                >
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                                {errors.code ? <FieldError>{errors.code}</FieldError> : null}
                            </Field>
                        )}

                        <Button type="submit" size="lg" className="w-full" disabled={processing}>
                            {processing ? <Spinner data-icon="inline-start" /> : null}
                            Verify
                        </Button>

                        <button
                            type="button"
                            onClick={() => setShowRecovery((value) => !value)}
                            className="text-center text-xs font-semibold tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground"
                        >
                            {showRecovery ? 'Use authentication code' : 'Use a recovery code'}
                        </button>
                    </>
                )}
            </Form>
        </>
    );
}

TwoFactorChallenge.layout = (page: ReactNode) => (
    <AuthLayout title="Two-factor authentication" description="Enter the code from your authenticator app to continue.">
        {page}
    </AuthLayout>
);
