import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator } from '@/components/ui/separator';

const meta: Meta<typeof Separator> = {
    title: 'UI/Separator',
    component: Separator,
};

export default meta;

type Story = StoryObj<typeof Separator>;

export const Default: Story = {
    render: () => (
        <div className="w-64">
            <p className="text-sm">Above the separator</p>
            <Separator className="my-2" />
            <p className="text-sm">Below the separator</p>
        </div>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="w-64">
                <p className="text-sm">Horizontal</p>
                <Separator className="my-2" />
                <p className="text-sm">Below</p>
            </div>
            <div className="flex h-8 items-center gap-4">
                <span className="text-sm">Left</span>
                <Separator orientation="vertical" />
                <span className="text-sm">Center</span>
                <Separator orientation="vertical" />
                <span className="text-sm">Right</span>
            </div>
        </div>
    ),
};
