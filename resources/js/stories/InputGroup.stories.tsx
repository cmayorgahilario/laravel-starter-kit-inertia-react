import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupInput,
} from '@/components/ui/input-group';

const meta: Meta<typeof InputGroup> = {
    title: 'UI/InputGroup',
    component: InputGroup,
};

export default meta;

type Story = StoryObj<typeof InputGroup>;

export const Default: Story = {
    render: () => (
        <InputGroup className="w-80">
            <InputGroupAddon align="inline-start">
                <InputGroupText>https://</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput placeholder="example.com" />
        </InputGroup>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex w-80 flex-col gap-4">
            <InputGroup>
                <InputGroupAddon align="inline-start">
                    <InputGroupText>@</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput placeholder="username" />
            </InputGroup>
            <InputGroup>
                <InputGroupInput placeholder="amount" />
                <InputGroupAddon align="inline-end">
                    <InputGroupText>.00</InputGroupText>
                </InputGroupAddon>
            </InputGroup>
            <InputGroup>
                <InputGroupAddon align="inline-start">
                    <InputGroupText>$</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput placeholder="0.00" />
                <InputGroupAddon align="inline-end">
                    <InputGroupText>USD</InputGroupText>
                </InputGroupAddon>
            </InputGroup>
        </div>
    ),
};
