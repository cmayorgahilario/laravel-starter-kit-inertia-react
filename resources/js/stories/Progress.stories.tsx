import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    Progress,
    ProgressLabel,
    ProgressValue,
} from '@/components/ui/progress';

const meta: Meta<typeof Progress> = {
    title: 'UI/Progress',
    component: Progress,
};

export default meta;

type Story = StoryObj<typeof Progress>;

export const Default: Story = {
    render: () => <Progress value={60} className="w-64" />,
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex w-64 flex-col gap-4">
            <Progress value={25} />
            <Progress value={60} />
            <Progress value={100} />
            <Progress value={45}>
                <ProgressLabel>Uploading…</ProgressLabel>
                <ProgressValue />
            </Progress>
        </div>
    ),
};
