import type { Meta, StoryObj } from '@storybook/react-vite';
import { Kbd, KbdGroup } from '@/components/ui/kbd';

const meta: Meta<typeof Kbd> = {
    title: 'UI/Kbd',
    component: Kbd,
};

export default meta;

type Story = StoryObj<typeof Kbd>;

export const Default: Story = {
    render: () => <Kbd>⌘K</Kbd>,
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
            </div>
            <KbdGroup>
                <Kbd>Ctrl</Kbd>
                <Kbd>C</Kbd>
            </KbdGroup>
            <KbdGroup>
                <Kbd>Shift</Kbd>
                <Kbd>⌘</Kbd>
                <Kbd>P</Kbd>
            </KbdGroup>
            <Kbd>Enter</Kbd>
            <Kbd>Escape</Kbd>
        </div>
    ),
};
