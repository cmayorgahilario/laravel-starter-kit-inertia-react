import { Form } from '@inertiajs/react';
import { CheckIcon, ShieldCheckIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { TwoFactorSetupModal } from '@/components/two-factor-setup-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import { disable, enable, regenerateRecoveryCodes } from '@/routes/two-factor';

interface ManageTwoFactorProps {
    enabled: boolean;
    requiresConfirmation: boolean;
}

export function ManageTwoFactor({ enabled, requiresConfirmation }: ManageTwoFactorProps) {
    const {
        qrCodeSvg,
        manualSetupKey,
        recoveryCodesList,
        clearSetupData,
        clearTwoFactorAuthData,
        fetchSetupData,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();

    const [showSetupModal, setShowSetupModal] = useState(false);
    const prevEnabled = useRef(enabled);

    // When 2FA is turned off, drop any cached setup/recovery data so a future
    // re-enable starts from a clean slate.
    useEffect(() => {
        if (prevEnabled.current && !enabled) {
            clearTwoFactorAuthData();
        }

        prevEnabled.current = enabled;
    }, [enabled, clearTwoFactorAuthData]);

    return (
        <Card>
            <CardHeader className="flex-row items-start justify-between border-b">
                <div className="grid gap-1.5">
                    <CardTitle>Two-factor authentication</CardTitle>
                    <CardDescription>
                        Add an extra layer of security by requiring a code from your authenticator app when you sign in.
                    </CardDescription>
                </div>
                {enabled ? (
                    <Badge variant="secondary">
                        <ShieldCheckIcon />
                        Active
                    </Badge>
                ) : null}
            </CardHeader>

            <CardContent className="flex flex-col gap-6">
                {enabled ? (
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => void fetchRecoveryCodes()}>
                                    View recovery codes
                                </Button>
                                {recoveryCodesList.length > 0 ? (
                                    <Form
                                        {...regenerateRecoveryCodes.form()}
                                        options={{ preserveScroll: true }}
                                        onSuccess={() => void fetchRecoveryCodes()}
                                    >
                                        {({ processing }) => (
                                            <Button variant="ghost" size="sm" type="submit" disabled={processing}>
                                                {processing ? <Spinner data-icon="inline-start" /> : null}
                                                Regenerate
                                            </Button>
                                        )}
                                    </Form>
                                ) : null}
                            </div>

                            {recoveryCodesList.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2 bg-muted p-4 font-mono text-sm">
                                    {recoveryCodesList.map((recoveryCode) => (
                                        <span key={recoveryCode} className="flex items-center gap-2">
                                            <CheckIcon className="size-3.5 shrink-0 text-muted-foreground" />
                                            {recoveryCode}
                                        </span>
                                    ))}
                                </div>
                            ) : null}
                        </div>

                        <div className="border-t border-border pt-5">
                            <Form {...disable.form()} options={{ preserveScroll: true }}>
                                {({ processing }) => (
                                    <Button variant="destructive" type="submit" disabled={processing}>
                                        {processing ? <Spinner data-icon="inline-start" /> : null}
                                        Disable two-factor authentication
                                    </Button>
                                )}
                            </Form>
                        </div>
                    </div>
                ) : (
                    <Form
                        {...enable.form()}
                        options={{ preserveScroll: true }}
                        onSuccess={() => setShowSetupModal(true)}
                    >
                        {({ processing }) => (
                            <Button type="submit" disabled={processing}>
                                {processing ? <Spinner data-icon="inline-start" /> : null}
                                Enable two-factor authentication
                            </Button>
                        )}
                    </Form>
                )}
            </CardContent>

            <TwoFactorSetupModal
                isOpen={showSetupModal}
                onClose={() => setShowSetupModal(false)}
                requiresConfirmation={requiresConfirmation}
                twoFactorEnabled={enabled}
                qrCodeSvg={qrCodeSvg}
                manualSetupKey={manualSetupKey}
                clearSetupData={clearSetupData}
                fetchSetupData={fetchSetupData}
                errors={errors}
            />
        </Card>
    );
}
