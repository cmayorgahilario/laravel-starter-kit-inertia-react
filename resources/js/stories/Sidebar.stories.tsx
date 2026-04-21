import type { Meta, StoryObj } from '@storybook/react-vite';
import { HomeIcon, SettingsIcon, UsersIcon } from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
} from '@/components/ui/sidebar';

const meta: Meta<typeof Sidebar> = {
    title: 'UI/Sidebar',
    component: Sidebar,
};

export default meta;

type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
    render: () => (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <span className="px-2 font-semibold">App</span>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton>
                                <HomeIcon />
                                <span>Home</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton>
                                <UsersIcon />
                                <span>Users</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton>
                                <SettingsIcon />
                                <span>Settings</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarContent>
            </Sidebar>
            <SidebarInset>
                <div className="p-6">
                    <h1 className="text-lg font-semibold">Main content</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Toggle the sidebar with Ctrl+B.
                    </p>
                </div>
            </SidebarInset>
        </SidebarProvider>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <SidebarProvider defaultOpen={false}>
            <Sidebar collapsible="icon">
                <SidebarHeader>
                    <span className="px-2 font-semibold">App</span>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton>
                                <HomeIcon />
                                <span>Home</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton>
                                <UsersIcon />
                                <span>Users</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton>
                                <SettingsIcon />
                                <span>Settings</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                <div className="p-6">
                    <h1 className="text-lg font-semibold">
                        Collapsed icon sidebar
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Sidebar is collapsed to icon-only mode.
                    </p>
                </div>
            </SidebarInset>
        </SidebarProvider>
    ),
};
