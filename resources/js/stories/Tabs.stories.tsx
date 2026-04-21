import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const meta: Meta<typeof Tabs> = {
    title: 'UI/Tabs',
    component: Tabs,
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
    render: () => (
        <Tabs defaultValue="account" className="w-96">
            <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="account">Account settings here.</TabsContent>
            <TabsContent value="password">
                Change your password here.
            </TabsContent>
            <TabsContent value="settings">General settings here.</TabsContent>
        </Tabs>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-8">
            <Tabs defaultValue="tab1" className="w-96">
                <TabsList>
                    <TabsTrigger value="tab1">Default</TabsTrigger>
                    <TabsTrigger value="tab2">Style</TabsTrigger>
                    <TabsTrigger value="tab3">Disabled</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1">Default list variant</TabsContent>
                <TabsContent value="tab2">Style tab</TabsContent>
                <TabsContent value="tab3">Disabled content</TabsContent>
            </Tabs>
            <Tabs defaultValue="tab1" className="w-96">
                <TabsList variant="line">
                    <TabsTrigger value="tab1">Line</TabsTrigger>
                    <TabsTrigger value="tab2">Style</TabsTrigger>
                    <TabsTrigger value="tab3">Disabled</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1">Line list variant</TabsContent>
                <TabsContent value="tab2">Style tab</TabsContent>
                <TabsContent value="tab3">Disabled content</TabsContent>
            </Tabs>
        </div>
    ),
};
