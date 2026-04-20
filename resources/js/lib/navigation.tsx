import {
    BookOpenIcon,
    BotIcon,
    CalendarIcon,
    FrameIcon,
    InboxIcon,
    LayoutDashboardIcon,
    LifeBuoy,
    MapIcon,
    PieChartIcon,
    Send,
    Settings2Icon,
    ShieldIcon,
    TerminalSquareIcon,
    UsersIcon,
} from 'lucide-react';
import * as React from 'react';
import type { NavMainItem } from '@/components/nav-main';
import { dashboard } from '@/routes';

export const mainNav: NavMainItem[] = [
    {
        type: 'single',
        title: 'Dashboard',
        url: dashboard.url(),
        icon: <LayoutDashboardIcon />,
    },
    {
        type: 'single',
        title: 'Inbox',
        url: '#',
        icon: <InboxIcon />,
    },
    {
        type: 'single',
        title: 'Documentation',
        url: '#',
        icon: <BookOpenIcon />,
        items: [
            { title: 'Introduction', url: '#' },
            { title: 'Get Started', url: '#' },
            { title: 'Tutorials', url: '#' },
            { title: 'Changelog', url: '#' },
        ],
    },
    {
        type: 'group',
        title: 'Workspace',
        items: [
            { title: 'Projects', url: '#', icon: <FrameIcon /> },
            { title: 'Team', url: '#', icon: <UsersIcon /> },
            { title: 'Calendar', url: '#', icon: <CalendarIcon /> },
        ],
    },
    {
        type: 'group',
        title: 'AI Tools',
        items: [
            {
                title: 'Playground',
                url: '#',
                icon: <TerminalSquareIcon />,
                items: [
                    { title: 'History', url: '#' },
                    { title: 'Starred', url: '#', isActive: true },
                    { title: 'Settings', url: '#' },
                ],
            },
            {
                title: 'Models',
                url: '#',
                icon: <BotIcon />,
                items: [
                    { title: 'Genesis', url: '#' },
                    { title: 'Explorer', url: '#' },
                    { title: 'Quantum', url: '#' },
                ],
            },
        ],
    },
    {
        type: 'group',
        title: 'Admin',
        items: [
            { title: 'Users', url: '#', icon: <UsersIcon /> },
            { title: 'Permissions', url: '#', icon: <ShieldIcon /> },
            {
                title: 'Settings',
                url: '#',
                icon: <Settings2Icon />,
                items: [
                    { title: 'General', url: '#' },
                    { title: 'Billing', url: '#' },
                    { title: 'Limits', url: '#' },
                ],
            },
        ],
    },
];

export type NavSecondaryItem = {
    title: string;
    url: string;
    icon: React.ReactNode;
};

export const navSecondary: NavSecondaryItem[] = [
    { title: 'Support', url: '#', icon: <LifeBuoy /> },
    { title: 'Feedback', url: '#', icon: <Send /> },
];

export type ProjectItem = {
    name: string;
    url: string;
    icon: React.ReactNode;
};

export const projects: ProjectItem[] = [
    { name: 'Design Engineering', url: '#', icon: <FrameIcon /> },
    { name: 'Sales & Marketing', url: '#', icon: <PieChartIcon /> },
    { name: 'Travel', url: '#', icon: <MapIcon /> },
];
