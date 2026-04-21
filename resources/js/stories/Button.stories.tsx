import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/components/ui/button';

const meta: Meta<typeof Button> = {
    title: 'UI/Button',
    component: Button,
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
    args: {
        children: 'Click me',
    },
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
                {(
                    [
                        'default',
                        'outline',
                        'secondary',
                        'ghost',
                        'destructive',
                        'link',
                    ] as const
                ).map((variant) => (
                    <Button key={variant} variant={variant}>
                        {variant}
                    </Button>
                ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
                {(['xs', 'sm', 'default', 'lg'] as const).map((size) => (
                    <Button key={size} size={size}>
                        {size}
                    </Button>
                ))}
                <Button disabled>Disabled</Button>
            </div>
        </div>
    ),
};
