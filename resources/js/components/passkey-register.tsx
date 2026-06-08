import { usePasskeyRegister } from '@laravel/passkeys/react';
import { KeyRoundIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

interface PasskeyRegistrationProps {
    onSuccess: () => void;
}

/**
 * Suggest a recognisable default name from the current browser and OS, e.g.
 * "Chrome on Windows". Best-effort only; the user can always overwrite it.
 */
function suggestPasskeyName(): string {
    if (typeof navigator === 'undefined') {
        return '';
    }

    const ua = navigator.userAgent;
    const browser = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'].find((name) => new RegExp(name).test(ua));
    const os = ['iPhone', 'iPad', 'Android', 'Mac', 'Windows'].find((name) => new RegExp(name).test(ua));

    return [browser, os].filter(Boolean).join(' on ');
}

export function PasskeyRegistration({ onSuccess }: PasskeyRegistrationProps) {
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState(suggestPasskeyName);

    const { register, isLoading, error, isSupported } = usePasskeyRegister({
        onSuccess: () => {
            setName('');
            setShowForm(false);
            toast.success('Passkey registered.');
            onSuccess();
        },
    });

    if (!isSupported) {
        return (
            <p className="border-t border-border pt-6 text-sm text-muted-foreground">
                Your browser doesn't support passkeys.
            </p>
        );
    }

    if (!showForm) {
        return (
            <div className="border-t border-border pt-6">
                <Button variant="outline" onClick={() => setShowForm(true)}>
                    <KeyRoundIcon data-icon="inline-start" />
                    Add passkey
                </Button>
            </div>
        );
    }

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (name.trim()) {
            void register(name.trim());
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setName(suggestPasskeyName());
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 border-t border-border pt-6">
            <Field data-invalid={error ? true : undefined}>
                <FieldLabel htmlFor="passkey_name">Passkey name</FieldLabel>
                <Input
                    id="passkey_name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Work MacBook"
                    maxLength={255}
                    autoFocus
                />
                <p className="text-xs text-muted-foreground">A name helps you identify this passkey later.</p>
                {error ? <FieldError>{error}</FieldError> : null}
            </Field>

            <div className="flex gap-2">
                <Button type="submit" disabled={isLoading || !name.trim()}>
                    {isLoading ? <Spinner data-icon="inline-start" /> : null}
                    Register passkey
                </Button>
                <Button type="button" variant="ghost" onClick={handleCancel} disabled={isLoading}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}
