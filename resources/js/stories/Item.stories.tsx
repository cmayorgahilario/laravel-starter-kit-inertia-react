import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/components/ui/button';
import {
    Item,
    ItemContent,
    ItemTitle,
    ItemDescription,
    ItemActions,
} from '@/components/ui/item';

const meta: Meta<typeof Item> = {
    title: 'UI/Item',
    component: Item,
};

export default meta;

type Story = StoryObj<typeof Item>;

export const Default: Story = {
    render: () => (
        <Item className="w-96">
            <ItemContent>
                <ItemTitle>Item title</ItemTitle>
                <ItemDescription>
                    A short description of this item.
                </ItemDescription>
            </ItemContent>
        </Item>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex w-96 flex-col gap-4">
            {(['default', 'outline', 'muted'] as const).map((variant) => (
                <Item key={variant} variant={variant}>
                    <ItemContent>
                        <ItemTitle>{variant}</ItemTitle>
                        <ItemDescription>
                            Item with {variant} variant style.
                        </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                        <Button size="sm" variant="outline">
                            Action
                        </Button>
                    </ItemActions>
                </Item>
            ))}
        </div>
    ),
};
