import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';

const meta: Meta<typeof ContextMenu> = {
    title: 'UI/ContextMenu',
    component: ContextMenu,
};

export default meta;

type Story = StoryObj<typeof ContextMenu>;

export const Default: Story = {
    render: () => (
        <ContextMenu>
            <ContextMenuTrigger>
                <div className="flex h-32 w-64 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                    Right-click here
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuLabel>Actions</ContextMenuLabel>
                <ContextMenuSeparator />
                <ContextMenuItem>
                    Copy
                    <ContextMenuShortcut>⌘C</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem>
                    Paste
                    <ContextMenuShortcut>⌘V</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-wrap gap-4">
            <ContextMenu>
                <ContextMenuTrigger>
                    <div className="flex h-24 w-48 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                        Right-click (standard)
                    </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem>Open</ContextMenuItem>
                    <ContextMenuItem>Rename</ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem variant="destructive">
                        Delete
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
            <ContextMenu>
                <ContextMenuTrigger>
                    <div className="flex h-24 w-48 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                        Right-click (with label)
                    </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuLabel>File actions</ContextMenuLabel>
                    <ContextMenuSeparator />
                    <ContextMenuItem>Open</ContextMenuItem>
                    <ContextMenuItem>Download</ContextMenuItem>
                    <ContextMenuItem>Share</ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        </div>
    ),
};
