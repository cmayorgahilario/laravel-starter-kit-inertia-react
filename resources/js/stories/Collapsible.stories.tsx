import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';

const meta: Meta<typeof Collapsible> = {
    title: 'UI/Collapsible',
    component: Collapsible,
};

export default meta;

type Story = StoryObj<typeof Collapsible>;

export const Default: Story = {
    render: () => (
        <Collapsible className="w-64">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Starred repositories</h4>
                <CollapsibleTrigger
                    render={<Button variant="ghost" size="sm" />}
                >
                    Toggle
                </CollapsibleTrigger>
            </div>
            <div className="mt-2 rounded-md border px-3 py-2 font-mono text-sm">
                @radix-ui/primitives
            </div>
            <CollapsibleContent className="mt-2 space-y-2">
                <div className="rounded-md border px-3 py-2 font-mono text-sm">
                    @radix-ui/colors
                </div>
                <div className="rounded-md border px-3 py-2 font-mono text-sm">
                    @stitches/react
                </div>
            </CollapsibleContent>
        </Collapsible>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-6">
            <Collapsible className="w-64">
                <CollapsibleTrigger
                    render={<Button variant="outline" className="w-full" />}
                >
                    Closed by default
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div className="mt-2 rounded-md border p-3 text-sm">
                        This content is hidden initially.
                    </div>
                </CollapsibleContent>
            </Collapsible>
            <Collapsible defaultOpen className="w-64">
                <CollapsibleTrigger
                    render={<Button variant="outline" className="w-full" />}
                >
                    Open by default
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div className="mt-2 rounded-md border p-3 text-sm">
                        This content is visible by default.
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    ),
};
