import type { PropsWithChildren } from 'react';

import { Heading } from '@/components/heading';
import { UcpSidebar } from '@/components/ucp-sidebar';
import { Separator } from '@/components/ui/separator';

export default function UcpLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex flex-col gap-8">
            <Heading
                title="Account settings"
                description="Manage your profile information, password, security and active sessions."
            />
            <Separator />
            <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
                <aside className="lg:w-56 lg:shrink-0">
                    <UcpSidebar />
                </aside>
                <div className="min-w-0 flex-1">{children}</div>
            </div>
        </div>
    );
}
