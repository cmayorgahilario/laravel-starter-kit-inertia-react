import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverHeader,
    PopoverTitle,
    PopoverDescription,
    PopoverTrigger,
} from '@/components/ui/popover';

const meta: Meta<typeof Popover> = {
    title: 'UI/Popover',
    component: Popover,
};

export default meta;

type Story = StoryObj<typeof Popover>;

export const Default: Story = {
    render: () => (
        <Popover>
            <PopoverTrigger render={<Button variant="outline" />}>
                Open popover
            </PopoverTrigger>
            <PopoverContent>
                <PopoverHeader>
                    <PopoverTitle>Dimensions</PopoverTitle>
                    <PopoverDescription>
                        Set the dimensions for the layer.
                    </PopoverDescription>
                </PopoverHeader>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="popover-width">Width</Label>
                        <Input id="popover-width" defaultValue="100%" />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-wrap gap-4">
            {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
                <Popover key={side}>
                    <PopoverTrigger render={<Button variant="outline" />}>
                        {side}
                    </PopoverTrigger>
                    <PopoverContent side={side}>
                        <p className="text-sm">Popover on the {side}.</p>
                    </PopoverContent>
                </Popover>
            ))}
        </div>
    ),
};
