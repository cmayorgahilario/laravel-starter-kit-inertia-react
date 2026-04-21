import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

const meta: Meta<typeof Tooltip> = {
    title: 'UI/Tooltip',
    component: Tooltip,
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
    render: () => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger render={<Button variant="outline" />}>
                    Hover me
                </TooltipTrigger>
                <TooltipContent>
                    <p>This is a tooltip</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <TooltipProvider>
            <div className="flex flex-wrap gap-4">
                {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
                    <Tooltip key={side}>
                        <TooltipTrigger
                            render={<Button variant="outline" size="sm" />}
                        >
                            {side}
                        </TooltipTrigger>
                        <TooltipContent side={side}>
                            <p>Tooltip on the {side}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </div>
        </TooltipProvider>
    ),
};
