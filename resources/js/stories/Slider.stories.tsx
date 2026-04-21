import type { Meta, StoryObj } from '@storybook/react-vite';
import { Slider } from '@/components/ui/slider';

const meta: Meta<typeof Slider> = {
    title: 'UI/Slider',
    component: Slider,
};

export default meta;

type Story = StoryObj<typeof Slider>;

export const Default: Story = {
    render: () => (
        <Slider defaultValue={[50]} min={0} max={100} className="w-64" />
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex w-64 flex-col gap-6">
            <div>
                <p className="mb-2 text-sm text-muted-foreground">
                    Single value
                </p>
                <Slider defaultValue={[33]} min={0} max={100} />
            </div>
            <div>
                <p className="mb-2 text-sm text-muted-foreground">Range</p>
                <Slider defaultValue={[25, 75]} min={0} max={100} />
            </div>
            <div>
                <p className="mb-2 text-sm text-muted-foreground">Disabled</p>
                <Slider defaultValue={[50]} min={0} max={100} disabled />
            </div>
        </div>
    ),
};
