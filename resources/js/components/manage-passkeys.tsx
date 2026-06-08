import { router } from '@inertiajs/react';
import { KeyRoundIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';

import { PasskeyRegistration } from '@/components/passkey-register';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { destroy } from '@/routes/passkey';
import type { Passkey } from '@/types';

interface ManagePasskeysProps {
    passkeys: Passkey[];
}

export function ManagePasskeys({ passkeys }: ManagePasskeysProps) {
    const handleDelete = (passkey: Passkey) => {
        router.delete(destroy.url(passkey.id), {
            preserveScroll: true,
            onSuccess: () => toast.success('Passkey removed.'),
        });
    };

    return (
        <Card>
            <CardHeader className="border-b">
                <CardTitle>Passkeys</CardTitle>
                <CardDescription>
                    Sign in without a password using your devices' fingerprint, face or PIN.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
                {passkeys.length > 0 ? (
                    <ul className="flex flex-col divide-y divide-border">
                        {passkeys.map((passkey) => (
                            <li key={passkey.id} className="flex items-center gap-4 py-4 first:pt-0">
                                <div className="flex size-10 shrink-0 items-center justify-center bg-muted text-muted-foreground">
                                    <KeyRoundIcon className="size-5" />
                                </div>
                                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                    <div className="flex items-center gap-2">
                                        <span className="truncate text-sm font-medium text-foreground">
                                            {passkey.name}
                                        </span>
                                        {passkey.authenticator ? (
                                            <Badge variant="secondary">{passkey.authenticator}</Badge>
                                        ) : null}
                                    </div>
                                    <span className="truncate text-xs text-muted-foreground">
                                        Added {passkey.created_at_diff}
                                        {passkey.last_used_at_diff ? ` · Used ${passkey.last_used_at_diff}` : ''}
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    aria-label="Remove passkey"
                                    onClick={() => handleDelete(passkey)}
                                >
                                    <Trash2Icon />
                                </Button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <Empty className="border border-dashed border-border py-8">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <KeyRoundIcon />
                            </EmptyMedia>
                            <EmptyTitle>No passkeys</EmptyTitle>
                            <EmptyDescription>You haven't registered any passkeys yet.</EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                )}

                <PasskeyRegistration onSuccess={() => router.reload({ only: ['passkeys'] })} />
            </CardContent>
        </Card>
    );
}
