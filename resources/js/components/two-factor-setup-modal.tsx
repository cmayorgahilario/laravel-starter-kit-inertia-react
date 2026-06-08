import { router } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { CheckIcon, CopyIcon, ScanLineIcon } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FieldError } from '@/components/ui/field';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Spinner } from '@/components/ui/spinner';
import { useClipboard } from '@/hooks/use-clipboard';
import { OTP_MAX_LENGTH } from '@/hooks/use-two-factor-auth';
import { confirm } from '@/routes/two-factor';

interface TwoFactorSetupModalProps {
    isOpen: boolean;
    onClose: () => void;
    requiresConfirmation: boolean;
    twoFactorEnabled: boolean;
    qrCodeSvg: string | null;
    manualSetupKey: string | null;
    errors: string[];
    clearSetupData: () => void;
    fetchSetupData: () => Promise<void>;
}

function ScanIcon() {
    return (
        <div className="mb-1 rounded-full border border-border bg-card p-0.5 shadow-sm">
            <div className="relative overflow-hidden rounded-full border border-border bg-muted p-2.5">
                <ScanLineIcon className="relative z-10 size-6 text-foreground" />
            </div>
        </div>
    );
}

function SetupStep({
    qrCodeSvg,
    manualSetupKey,
    buttonText,
    onNextStep,
    errors,
}: {
    qrCodeSvg: string | null;
    manualSetupKey: string | null;
    buttonText: string;
    onNextStep: () => void;
    errors: string[];
}) {
    const [copiedText, copy] = useClipboard();
    const CopyStateIcon = copiedText && copiedText === manualSetupKey ? CheckIcon : CopyIcon;

    if (errors.length > 0) {
        return (
            <div className="w-full space-y-2 border border-destructive/30 bg-destructive/5 p-4">
                {errors.map((message) => (
                    <FieldError key={message}>{message}</FieldError>
                ))}
            </div>
        );
    }

    return (
        <>
            <div className="mx-auto aspect-square w-56 border border-border bg-white p-3">
                {qrCodeSvg ? (
                    <div className="size-full [&>svg]:size-full" dangerouslySetInnerHTML={{ __html: qrCodeSvg }} />
                ) : (
                    <div className="flex size-full items-center justify-center">
                        <Spinner />
                    </div>
                )}
            </div>

            <Button className="w-full" onClick={onNextStep} disabled={!qrCodeSvg}>
                {buttonText}
            </Button>

            <div className="relative flex w-full items-center justify-center">
                <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
                <span className="relative bg-card px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    or enter the key manually
                </span>
            </div>

            <div className="flex w-full items-stretch overflow-hidden border border-border">
                {manualSetupKey ? (
                    <>
                        <input
                            type="text"
                            readOnly
                            value={manualSetupKey}
                            className="w-full bg-background p-3 font-mono text-sm text-foreground outline-none"
                        />
                        <button
                            type="button"
                            aria-label="Copy key"
                            onClick={() => void copy(manualSetupKey)}
                            className="border-l border-border px-3 text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                            <CopyStateIcon className="size-4" />
                        </button>
                    </>
                ) : (
                    <div className="flex w-full items-center justify-center bg-muted p-3">
                        <Spinner />
                    </div>
                )}
            </div>
        </>
    );
}

function VerificationStep({ onClose, onBack }: { onClose: () => void; onBack: () => void }) {
    const [code, setCode] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleConfirm = () => {
        setProcessing(true);
        setError(null);

        router.post(
            confirm.url(),
            { code },
            {
                preserveScroll: true,
                onSuccess: () => onClose(),
                onError: (errors) => {
                    setCode('');
                    setError(errors.code ?? 'Invalid code.');
                },
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <div className="flex w-full flex-col items-center gap-4">
            <InputOTP
                id="otp"
                maxLength={OTP_MAX_LENGTH}
                value={code}
                onChange={setCode}
                disabled={processing}
                pattern={REGEXP_ONLY_DIGITS}
                autoFocus
            >
                <InputOTPGroup>
                    {Array.from({ length: OTP_MAX_LENGTH }, (_, index) => (
                        <InputOTPSlot key={index} index={index} />
                    ))}
                </InputOTPGroup>
            </InputOTP>

            {error ? <FieldError>{error}</FieldError> : null}

            <div className="flex w-full gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={onBack} disabled={processing}>
                    Back
                </Button>
                <Button
                    type="button"
                    className="flex-1"
                    onClick={handleConfirm}
                    disabled={processing || code.length < OTP_MAX_LENGTH}
                >
                    {processing ? <Spinner data-icon="inline-start" /> : null}
                    Confirm
                </Button>
            </div>
        </div>
    );
}

export function TwoFactorSetupModal({
    isOpen,
    onClose,
    requiresConfirmation,
    twoFactorEnabled,
    qrCodeSvg,
    manualSetupKey,
    errors,
    clearSetupData,
    fetchSetupData,
}: TwoFactorSetupModalProps) {
    const [showVerificationStep, setShowVerificationStep] = useState(false);

    const modalConfig = useMemo(() => {
        if (twoFactorEnabled) {
            return {
                title: 'Two-factor authentication enabled',
                description:
                    'Two-factor authentication is already active. Scan the QR code or enter the key in your authenticator app.',
                buttonText: 'Close',
            };
        }

        if (showVerificationStep) {
            return {
                title: 'Verify the code',
                description: 'Enter the 6-digit code from your authenticator app.',
                buttonText: 'Continue',
            };
        }

        return {
            title: 'Enable two-factor authentication',
            description: 'To finish, scan the QR code or enter the setup key in your authenticator app.',
            buttonText: 'Continue',
        };
    }, [twoFactorEnabled, showVerificationStep]);

    const resetModalState = useCallback(() => {
        setShowVerificationStep(false);
        clearSetupData();
    }, [clearSetupData]);

    const handleClose = useCallback(() => {
        resetModalState();
        onClose();
    }, [onClose, resetModalState]);

    const handleNextStep = useCallback(() => {
        if (requiresConfirmation && !twoFactorEnabled) {
            setShowVerificationStep(true);

            return;
        }

        handleClose();
    }, [requiresConfirmation, twoFactorEnabled, handleClose]);

    const fetchSetupDataRef = useRef(fetchSetupData);

    useEffect(() => {
        fetchSetupDataRef.current = fetchSetupData;
    }, [fetchSetupData]);

    useEffect(() => {
        if (isOpen && !qrCodeSvg) {
            void fetchSetupDataRef.current();
        }
    }, [isOpen, qrCodeSvg]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="items-center">
                    <ScanIcon />
                    <DialogTitle>{modalConfig.title}</DialogTitle>
                    <DialogDescription className="text-center">{modalConfig.description}</DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center gap-5">
                    {showVerificationStep && !twoFactorEnabled ? (
                        <VerificationStep onClose={handleClose} onBack={() => setShowVerificationStep(false)} />
                    ) : (
                        <SetupStep
                            qrCodeSvg={qrCodeSvg}
                            manualSetupKey={manualSetupKey}
                            buttonText={modalConfig.buttonText}
                            onNextStep={handleNextStep}
                            errors={errors}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
