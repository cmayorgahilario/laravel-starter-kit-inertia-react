import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const meta: Meta<typeof ScrollArea> = {
    title: 'UI/ScrollArea',
    component: ScrollArea,
};

export default meta;

type Story = StoryObj<typeof ScrollArea>;

const items = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`);

export const Default: Story = {
    render: () => (
        <ScrollArea className="h-48 w-64 rounded-md border p-4">
            {items.map((item) => (
                <div key={item} className="py-1 text-sm">
                    {item}
                </div>
            ))}
        </ScrollArea>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-6">
            <div>
                <p className="mb-2 text-sm text-muted-foreground">
                    Vertical scroll
                </p>
                <ScrollArea className="h-48 w-64 rounded-md border p-4">
                    {items.map((item) => (
                        <div key={item} className="py-1 text-sm">
                            {item}
                        </div>
                    ))}
                </ScrollArea>
            </div>
            <div>
                <p className="mb-2 text-sm text-muted-foreground">
                    Horizontal scroll
                </p>
                <ScrollArea className="w-64 rounded-md border whitespace-nowrap">
                    <div className="flex gap-2 p-4">
                        {Array.from({ length: 10 }, (_, i) => (
                            <div
                                key={i}
                                className="flex h-20 w-32 shrink-0 items-center justify-center rounded-md bg-muted text-sm"
                            >
                                Panel {i + 1}
                            </div>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </div>
    ),
};
