import { Form, Head } from '@inertiajs/react';
import { MonitorIcon, SmartphoneIcon } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';

import { destroyOthers } from '@/actions/App/Http/Controllers/Security/BrowserSessionsController';
import { PasswordInput } from '@/components/password-input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import UcpLayout from '@/layouts/ucp-layout';
import type { SessionRecord } from '@/types';

interface SessionsProps {
    sessions: SessionRecord[];
}

const mobilePlatforms = ['iOS', 'Android'];

export default function UcpSessions({ sessions }: SessionsProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Head title="Sessions" />

            <Card>
                <CardHeader className="border-b">
                    <CardTitle>Active sessions</CardTitle>
                    <CardDescription>
                        The devices where your account is signed in. If you don't recognize one, sign out the other
                        sessions.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                    <ul className="flex flex-col divide-y divide-border">
                        {sessions.map((session) => {
                            const Icon = mobilePlatforms.includes(session.platform) ? SmartphoneIcon : MonitorIcon;

                            return (
                                <li key={session.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                                    <div className="flex size-10 shrink-0 items-center justify-center bg-muted text-muted-foreground">
                                        <Icon className="size-5" />
                                    </div>
                                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                        <div className="flex items-center gap-2">
                                            <span className="truncate text-sm font-medium text-foreground">
                                                {session.browser} · {session.platform}
                                            </span>
                                            {session.is_current_device ? (
                                                <Badge variant="secondary">This device</Badge>
                                            ) : null}
                                        </div>
                                        <span className="truncate text-xs text-muted-foreground">
                                            {session.ip_address ?? 'Unknown IP'} · {session.last_active}
                                        </span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    <div>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger render={<Button variant="outline" />}>Sign out other sessions</DialogTrigger>
                            <DialogContent>
                                <Form
                                    action={destroyOthers.url()}
                                    method="delete"
                                    errorBag="logoutOtherBrowserSessions"
                                    resetOnSuccess={['password']}
                                    onSuccess={() => setOpen(false)}
                                    className="flex flex-col gap-6"
                                >
                                    {({ processing, errors }) => (
                                        <>
                                            <DialogHeader>
                                                <DialogTitle>Sign out other sessions</DialogTitle>
                                                <DialogDescription>
                                                    Enter your password to sign out of all your other devices.
                                                </DialogDescription>
                                            </DialogHeader>

                                            <Field data-invalid={errors.password ? true : undefined}>
                                                <FieldLabel htmlFor="sessions_password">Password</FieldLabel>
                                                <PasswordInput
                                                    id="sessions_password"
                                                    name="password"
                                                    autoComplete="current-password"
                                                    required
                                                    aria-invalid={errors.password ? true : undefined}
                                                    placeholder="••••••••"
                                                />
                                                {errors.password ? <FieldError>{errors.password}</FieldError> : null}
                                            </Field>

                                            <DialogFooter>
                                                <DialogClose render={<Button variant="outline" type="button" />}>
                                                    Cancel
                                                </DialogClose>
                                                <Button type="submit" disabled={processing}>
                                                    {processing ? <Spinner data-icon="inline-start" /> : null}
                                                    Sign out other sessions
                                                </Button>
                                            </DialogFooter>
                                        </>
                                    )}
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

UcpSessions.layout = (page: ReactNode) => (
    <AppLayout>
        <UcpLayout>{page}</UcpLayout>
    </AppLayout>
);
