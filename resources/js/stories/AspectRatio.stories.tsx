import type { Meta, StoryObj } from '@storybook/react-vite';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const meta: Meta<typeof AspectRatio> = {
    title: 'UI/AspectRatio',
    component: AspectRatio,
};

export default meta;

type Story = StoryObj<typeof AspectRatio>;

export const Default: Story = {
    render: () => (
        <AspectRatio ratio={16 / 9} className="w-64 rounded-md bg-muted">
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                16 / 9
            </div>
        </AspectRatio>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-wrap gap-4">
            {(
                [
                    [16, 9],
                    [4, 3],
                    [1, 1],
                    [9, 16],
                ] as [number, number][]
            ).map(([w, h]) => (
                <AspectRatio
                    key={`${w}:${h}`}
                    ratio={w / h}
                    className="w-32 rounded-md bg-muted"
                >
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                        {w}:{h}
                    </div>
                </AspectRatio>
            ))}
        </div>
    ),
};
