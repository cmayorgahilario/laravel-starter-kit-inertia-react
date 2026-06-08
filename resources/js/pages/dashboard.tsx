import { Head, usePage } from '@inertiajs/react';
import { LayoutGridIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { Heading } from '@/components/heading';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import AppLayout from '@/layouts/app-layout';
import type { SharedData } from '@/types';

export default function Dashboard() {
    const { name } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-8">
                <Heading title="Dashboard" description={`Your workspace on ${name}.`} />

                <Empty className="min-h-[26rem] border border-dashed border-border bg-card/40">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <LayoutGridIcon />
                        </EmptyMedia>
                        <EmptyTitle>Your content goes here</EmptyTitle>
                        <EmptyDescription>
                            This panel is a starting point. Soon you'll find your metrics and shortcuts here.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </div>
        </>
    );
}

Dashboard.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>;
