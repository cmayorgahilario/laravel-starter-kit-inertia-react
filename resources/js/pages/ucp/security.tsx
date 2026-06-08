import { Head, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';

import { ManagePasskeys } from '@/components/manage-passkeys';
import { ManageTwoFactor } from '@/components/manage-two-factor';
import AppLayout from '@/layouts/app-layout';
import UcpLayout from '@/layouts/ucp-layout';
import type { Passkey, SharedData } from '@/types';

interface SecurityProps {
    requiresConfirmation: boolean;
    passkeys: Passkey[];
}

export default function UcpSecurity({ requiresConfirmation, passkeys }: SecurityProps) {
    const { auth } = usePage<SharedData>().props;
    const enabled = auth.user?.two_factor_enabled ?? false;

    return (
        <>
            <Head title="Security" />

            <div className="flex flex-col gap-8">
                <ManageTwoFactor enabled={enabled} requiresConfirmation={requiresConfirmation} />
                <ManagePasskeys passkeys={passkeys} />
            </div>
        </>
    );
}

UcpSecurity.layout = (page: ReactNode) => (
    <AppLayout>
        <UcpLayout>{page}</UcpLayout>
    </AppLayout>
);
