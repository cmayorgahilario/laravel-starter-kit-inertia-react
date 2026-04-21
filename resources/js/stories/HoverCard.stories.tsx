import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';

const meta: Meta<typeof HoverCard> = {
    title: 'UI/HoverCard',
    component: HoverCard,
};

export default meta;

type Story = StoryObj<typeof HoverCard>;

export const Default: Story = {
    render: () => (
        <HoverCard>
            <HoverCardTrigger>
                <span className="cursor-pointer underline underline-offset-4">
                    @shadcn
                </span>
            </HoverCardTrigger>
            <HoverCardContent>
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold">@shadcn</p>
                    <p className="text-sm text-muted-foreground">
                        The React Framework — created and maintained by @vercel.
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Joined December 2021
                    </p>
                </div>
            </HoverCardContent>
        </HoverCard>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-wrap gap-6">
            <HoverCard>
                <HoverCardTrigger>
                    <span className="cursor-pointer underline underline-offset-4">
                        Hover me (top)
                    </span>
                </HoverCardTrigger>
                <HoverCardContent side="top">
                    <p className="text-sm">Content above the trigger.</p>
                </HoverCardContent>
            </HoverCard>
            <HoverCard>
                <HoverCardTrigger>
                    <span className="cursor-pointer underline underline-offset-4">
                        Hover me (bottom)
                    </span>
                </HoverCardTrigger>
                <HoverCardContent side="bottom">
                    <p className="text-sm">Content below the trigger.</p>
                </HoverCardContent>
            </HoverCard>
            <HoverCard>
                <HoverCardTrigger>
                    <span className="cursor-pointer underline underline-offset-4">
                        Hover me (right)
                    </span>
                </HoverCardTrigger>
                <HoverCardContent side="right">
                    <p className="text-sm">Content to the right.</p>
                </HoverCardContent>
            </HoverCard>
        </div>
    ),
};
