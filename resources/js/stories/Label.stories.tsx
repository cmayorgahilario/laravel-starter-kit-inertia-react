import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const meta: Meta<typeof Label> = {
    title: 'UI/Label',
    component: Label,
};

export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = {
    render: () => (
        <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
        </div>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
                <Label htmlFor="default-input">Default label</Label>
                <Input id="default-input" placeholder="Input with label" />
            </div>
            <div className="flex flex-col gap-1.5">
                <Label
                    htmlFor="disabled-input"
                    className="text-muted-foreground"
                >
                    Muted label
                </Label>
                <Input
                    id="disabled-input"
                    placeholder="Muted label example"
                    disabled
                />
            </div>
            <div className="flex items-center gap-2">
                <Input id="inline-check" type="checkbox" className="size-4" />
                <Label htmlFor="inline-check">Inline checkbox label</Label>
            </div>
        </div>
    ),
};
