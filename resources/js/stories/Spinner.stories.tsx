import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from '@/components/ui/spinner';

const meta: Meta<typeof Spinner> = {
    title: 'UI/Spinner',
    component: Spinner,
};

export default meta;

type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
    render: () => <Spinner />,
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <Spinner className="size-4" />
            <Spinner className="size-6" />
            <Spinner className="size-8" />
            <Spinner className="size-10" />
        </div>
    ),
};
