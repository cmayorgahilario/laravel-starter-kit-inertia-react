import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

const meta: Meta<typeof AppSidebar> = {
    title: 'Layouts/AppSidebar',
    component: AppSidebar,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'The full application sidebar, combining AppLogo, NavMain, NavProjects, NavSecondary, and NavUser. Uses the mocked `usePage()` for auth data and the `mainNav`/`projects`/`navSecondary` data modules.',
            },
        },
    },
    decorators: [
        (Story) => (
            <SidebarProvider>
                <Story />
                <SidebarInset>
                    <div className="flex h-screen items-center justify-center p-8 text-muted-foreground">
                        Page content area
                    </div>
                </SidebarInset>
            </SidebarProvider>
        ),
    ],
};

export default meta;

type Story = StoryObj<typeof AppSidebar>;

export const Default: Story = {};
