import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const meta: Meta<typeof Alert> = {
    title: 'UI/Alert',
    component: Alert,
};

export default meta;

type Story = StoryObj<typeof Alert>;

export const Default: Story = {
    render: () => (
        <Alert className="w-96">
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
                You can add components and dependencies to your app.
            </AlertDescription>
        </Alert>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex w-96 flex-col gap-4">
            <Alert>
                <AlertTitle>Default</AlertTitle>
                <AlertDescription>
                    This is a default alert message.
                </AlertDescription>
            </Alert>
            <Alert variant="destructive">
                <AlertTitle>Destructive</AlertTitle>
                <AlertDescription>
                    Your session has expired. Please log in again.
                </AlertDescription>
            </Alert>
        </div>
    ),
};
