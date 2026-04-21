import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from '@/components/ui/textarea';

const meta: Meta<typeof Textarea> = {
    title: 'UI/Textarea',
    component: Textarea,
};

export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
    args: {
        placeholder: 'Type your message here.',
    },
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex w-80 flex-col gap-3">
            <Textarea placeholder="Default" />
            <Textarea placeholder="Disabled" disabled />
            <Textarea defaultValue="With value" />
            <Textarea placeholder="Invalid" aria-invalid={true} />
        </div>
    ),
};
