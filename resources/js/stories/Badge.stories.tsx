import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '@/components/ui/badge';

const meta: Meta<typeof Badge> = {
    title: 'UI/Badge',
    component: Badge,
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
    render: () => <Badge>Badge</Badge>,
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-wrap gap-2">
            {(
                [
                    'default',
                    'secondary',
                    'destructive',
                    'outline',
                    'ghost',
                    'link',
                ] as const
            ).map((variant) => (
                <Badge key={variant} variant={variant}>
                    {variant}
                </Badge>
            ))}
        </div>
    ),
};
