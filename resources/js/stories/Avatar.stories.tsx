import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    Avatar,
    AvatarFallback,
    AvatarGroup,
    AvatarGroupCount,
} from '@/components/ui/avatar';

const meta: Meta<typeof Avatar> = {
    title: 'UI/Avatar',
    component: Avatar,
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
    render: () => (
        <Avatar>
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
                {(['sm', 'default', 'lg'] as const).map((size) => (
                    <Avatar key={size} size={size}>
                        <AvatarFallback>
                            {size.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                ))}
            </div>
            <AvatarGroup>
                <Avatar>
                    <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <Avatar>
                    <AvatarFallback>B</AvatarFallback>
                </Avatar>
                <Avatar>
                    <AvatarFallback>C</AvatarFallback>
                </Avatar>
                <AvatarGroupCount>+5</AvatarGroupCount>
            </AvatarGroup>
        </div>
    ),
};
