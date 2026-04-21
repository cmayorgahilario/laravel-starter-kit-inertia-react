import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toggle } from '@/components/ui/toggle';

const meta: Meta<typeof Toggle> = {
    title: 'UI/Toggle',
    component: Toggle,
};

export default meta;

type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
    render: () => <Toggle>Bold</Toggle>,
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-wrap gap-2">
            {(['default', 'outline'] as const).flatMap((variant) =>
                (['default', 'sm', 'lg'] as const).map((size) => (
                    <Toggle
                        key={`${variant}-${size}`}
                        variant={variant}
                        size={size}
                    >
                        {variant}/{size}
                    </Toggle>
                )),
            )}
        </div>
    ),
};
