import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from '@/components/ui/input';

const meta: Meta<typeof Input> = {
    title: 'UI/Input',
    component: Input,
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
    args: {
        placeholder: 'Type something…',
    },
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex w-64 flex-col gap-3">
            <Input placeholder="Default" />
            <Input placeholder="Disabled" disabled />
            <Input defaultValue="With value" />
            <Input placeholder="Invalid field" aria-invalid={true} />
            <Input type="email" placeholder="email@example.com" />
            <Input type="password" placeholder="Password" />
        </div>
    ),
};
