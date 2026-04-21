import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable';

const meta: Meta<typeof ResizablePanelGroup> = {
    title: 'UI/Resizable',
    component: ResizablePanelGroup,
};

export default meta;

type Story = StoryObj<typeof ResizablePanelGroup>;

export const Default: Story = {
    render: () => (
        <ResizablePanelGroup
            direction="horizontal"
            className="h-48 w-96 rounded-lg border"
        >
            <ResizablePanel defaultSize={50}>
                <div className="flex h-full items-center justify-center p-4">
                    <span className="text-sm text-muted-foreground">
                        Left panel
                    </span>
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50}>
                <div className="flex h-full items-center justify-center p-4">
                    <span className="text-sm text-muted-foreground">
                        Right panel
                    </span>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-6">
            <div>
                <p className="mb-2 text-sm text-muted-foreground">Horizontal</p>
                <ResizablePanelGroup
                    direction="horizontal"
                    className="h-32 w-96 rounded-lg border"
                >
                    <ResizablePanel defaultSize={33}>
                        <div className="flex h-full items-center justify-center p-2 text-xs text-muted-foreground">
                            1/3
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={33}>
                        <div className="flex h-full items-center justify-center p-2 text-xs text-muted-foreground">
                            1/3
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={33}>
                        <div className="flex h-full items-center justify-center p-2 text-xs text-muted-foreground">
                            1/3
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
            <div>
                <p className="mb-2 text-sm text-muted-foreground">Vertical</p>
                <ResizablePanelGroup
                    direction="vertical"
                    className="h-48 w-96 rounded-lg border"
                >
                    <ResizablePanel defaultSize={50}>
                        <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
                            Top panel
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={50}>
                        <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
                            Bottom panel
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    ),
};
