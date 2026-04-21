import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';

const meta: Meta<typeof ButtonGroup> = {
    title: 'UI/ButtonGroup',
    component: ButtonGroup,
};

export default meta;

type Story = StoryObj<typeof ButtonGroup>;

export const Default: Story = {
    render: () => (
        <ButtonGroup>
            <Button variant="outline">Cut</Button>
            <Button variant="outline">Copy</Button>
            <Button variant="outline">Paste</Button>
        </ButtonGroup>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-6">
            <div>
                <p className="mb-2 text-sm text-muted-foreground">Horizontal</p>
                <ButtonGroup orientation="horizontal">
                    <Button variant="outline">Left</Button>
                    <Button variant="outline">Center</Button>
                    <Button variant="outline">Right</Button>
                </ButtonGroup>
            </div>
            <div>
                <p className="mb-2 text-sm text-muted-foreground">Vertical</p>
                <ButtonGroup orientation="vertical">
                    <Button variant="outline">Top</Button>
                    <Button variant="outline">Middle</Button>
                    <Button variant="outline">Bottom</Button>
                </ButtonGroup>
            </div>
        </div>
    ),
};
