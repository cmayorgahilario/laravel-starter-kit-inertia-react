import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const meta: Meta<typeof Switch> = {
    title: 'UI/Switch',
    component: Switch,
};

export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {
    render: () => (
        <div className="flex items-center gap-2">
            <Switch id="airplane" />
            <Label htmlFor="airplane">Airplane mode</Label>
        </div>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
                <Switch id="sw-off" />
                <Label htmlFor="sw-off">Off (default)</Label>
            </div>
            <div className="flex items-center gap-2">
                <Switch id="sw-on" defaultChecked />
                <Label htmlFor="sw-on">On</Label>
            </div>
            <div className="flex items-center gap-2">
                <Switch id="sw-sm" size="sm" />
                <Label htmlFor="sw-sm">Small size</Label>
            </div>
            <div className="flex items-center gap-2">
                <Switch id="sw-disabled" disabled />
                <Label htmlFor="sw-disabled">Disabled</Label>
            </div>
        </div>
    ),
};
