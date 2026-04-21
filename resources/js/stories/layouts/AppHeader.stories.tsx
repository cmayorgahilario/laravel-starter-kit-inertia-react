import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppHeader } from '@/components/app-header';

const meta: Meta<typeof AppHeader> = {
    title: 'Layouts/AppHeader',
    component: AppHeader,
    argTypes: {
        breadcrumbs: {
            control: 'object',
            description:
                'Optional breadcrumbs rendered below the header when there are 2+ items.',
        },
    },
    args: {
        breadcrumbs: [],
    },
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'Top navigation header used with the `header` AppShell variant. Pulls the authenticated user from the mocked `usePage()` and uses the shared `mainNav` data module for desktop and mobile menus.',
            },
        },
    },
    decorators: [
        (Story) => (
            <div className="flex min-h-screen flex-col">
                <Story />
                <main className="flex flex-1 items-center justify-center p-8 text-muted-foreground">
                    Page content area
                </main>
            </div>
        ),
    ],
};

export default meta;

type Story = StoryObj<typeof AppHeader>;

export const NoBreadcrumbs: Story = {};

export const WithBreadcrumbs: Story = {
    args: {
        breadcrumbs: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Settings', url: '/settings' },
            { title: 'Profile', url: '/settings/profile' },
        ],
    },
};
