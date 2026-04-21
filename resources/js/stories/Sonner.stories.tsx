import type { Meta, StoryObj } from '@storybook/react-vite';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';

const meta: Meta<typeof Toaster> = {
    title: 'UI/Sonner',
    component: Toaster,
};

export default meta;

type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
    render: () => (
        <div>
            <Toaster />
            <Button
                variant="outline"
                onClick={() => toast('Event has been created')}
            >
                Show toast
            </Button>
        </div>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-wrap gap-2">
            <Toaster />
            <Button
                variant="outline"
                onClick={() => toast('Default toast message')}
            >
                Default
            </Button>
            <Button
                variant="outline"
                onClick={() => toast.success('Successfully saved!')}
            >
                Success
            </Button>
            <Button
                variant="outline"
                onClick={() => toast.error('Something went wrong.')}
            >
                Error
            </Button>
            <Button
                variant="outline"
                onClick={() =>
                    toast.warning('This action may have side effects.')
                }
            >
                Warning
            </Button>
            <Button
                variant="outline"
                onClick={() => toast.info('A new update is available.')}
            >
                Info
            </Button>
            <Button
                variant="outline"
                onClick={() =>
                    toast.promise(
                        new Promise((resolve) => setTimeout(resolve, 2000)),
                        {
                            loading: 'Saving…',
                            success: 'Saved!',
                            error: 'Failed to save.',
                        },
                    )
                }
            >
                Promise
            </Button>
        </div>
    ),
};
