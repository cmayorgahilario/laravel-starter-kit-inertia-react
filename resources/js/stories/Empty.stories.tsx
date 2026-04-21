import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/components/ui/button';
import {
    Empty,
    EmptyHeader,
    EmptyTitle,
    EmptyDescription,
    EmptyContent,
    EmptyMedia,
} from '@/components/ui/empty';

const meta: Meta<typeof Empty> = {
    title: 'UI/Empty',
    component: Empty,
};

export default meta;

type Story = StoryObj<typeof Empty>;

export const Default: Story = {
    render: () => (
        <Empty className="w-96">
            <EmptyHeader>
                <EmptyTitle>No results found</EmptyTitle>
                <EmptyDescription>
                    Try adjusting your search or filter to find what you're
                    looking for.
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-8">
            <Empty className="w-96">
                <EmptyHeader>
                    <EmptyTitle>Empty with action</EmptyTitle>
                    <EmptyDescription>
                        No items yet. Create your first one to get started.
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button>Create item</Button>
                </EmptyContent>
            </Empty>
            <Empty className="w-96">
                <EmptyMedia variant="icon">
                    <span className="text-3xl">📭</span>
                </EmptyMedia>
                <EmptyHeader>
                    <EmptyTitle>No messages</EmptyTitle>
                    <EmptyDescription>
                        Your inbox is empty. New messages will appear here.
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        </div>
    ),
};
