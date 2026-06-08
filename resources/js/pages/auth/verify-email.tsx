import { Form, Head, router } from '@inertiajs/react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

interface VerifyEmailProps {
    status?: string;
}

export default function VerifyEmail({ status }: VerifyEmailProps) {
    return (
        <>
            <Head title="Verify your email" />

            {status === 'verification-link-sent' ? (
                <div className="border border-border bg-muted/50 px-4 py-3 text-center text-sm text-muted-foreground">
                    We sent a new verification link to your email.
                </div>
            ) : null}

            <Form action={send.url()} method="post" className="flex flex-col gap-4">
                {({ processing }) => (
                    <Button type="submit" size="lg" className="w-full" disabled={processing}>
                        {processing ? <Spinner data-icon="inline-start" /> : null}
                        Resend verification link
                    </Button>
                )}
            </Form>

            <button
                type="button"
                onClick={() => router.post(logout.url())}
                className="text-center text-xs font-semibold tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground"
            >
                Sign out
            </button>
        </>
    );
}

VerifyEmail.layout = (page: ReactNode) => (
    <AuthLayout
        title="Verify your email"
        description="We sent a verification link. Check your inbox to activate your account."
    >
        {page}
    </AuthLayout>
);
