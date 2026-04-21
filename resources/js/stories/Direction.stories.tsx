import type { Meta, StoryObj } from '@storybook/react-vite';
import { DirectionProvider } from '@/components/ui/direction';

const meta: Meta<typeof DirectionProvider> = {
    title: 'UI/Direction',
    component: DirectionProvider,
};

export default meta;

type Story = StoryObj<typeof DirectionProvider>;

export const Default: Story = {
    render: () => (
        <DirectionProvider direction="ltr">
            <div className="rounded-md border p-4 text-sm">
                <p>Left-to-right (LTR) direction provider.</p>
                <p className="mt-1 text-muted-foreground">
                    Text flows from left to right.
                </p>
            </div>
        </DirectionProvider>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <div>
                <p className="mb-2 text-sm text-muted-foreground">
                    LTR (Left-to-Right)
                </p>
                <DirectionProvider direction="ltr">
                    <div className="rounded-md border p-4 text-sm" dir="ltr">
                        <p>This text flows left to right.</p>
                        <p className="text-muted-foreground">Hello, World!</p>
                    </div>
                </DirectionProvider>
            </div>
            <div>
                <p className="mb-2 text-sm text-muted-foreground">
                    RTL (Right-to-Left)
                </p>
                <DirectionProvider direction="rtl">
                    <div className="rounded-md border p-4 text-sm" dir="rtl">
                        <p>هذا النص يتدفق من اليمين إلى اليسار.</p>
                        <p className="text-muted-foreground">مرحبا بالعالم!</p>
                    </div>
                </DirectionProvider>
            </div>
        </div>
    ),
};
