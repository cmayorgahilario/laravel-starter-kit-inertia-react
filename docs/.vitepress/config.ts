import { defineConfig } from 'vitepress';

export default defineConfig({
    title: 'React Starter Kit Docs',
    description: 'Documentation for the React Starter Kit',

    srcExclude: ['**/_template/**'],
    ignoreDeadLinks: true,

    markdown: {
        mermaid: true,
    },

    themeConfig: {
        search: {
            provider: 'local',
        },

        sidebar: [
            {
                text: 'Introduction',
                items: [
                    { text: 'Overview', link: '/' },
                    { text: 'Getting Started', link: '/getting-started/' },
                ],
            },
            {
                text: 'Architecture',
                items: [
                    { text: 'Overview', link: '/architecture/' },
                    { text: 'App Configuration', link: '/architecture/app-configuration' },
                    { text: 'Domain Namespaces', link: '/architecture/domain-namespaces' },
                ],
            },
            {
                text: 'Frontend',
                items: [
                    { text: 'Pipeline', link: '/frontend/' },
                    { text: 'shadcn/ui', link: '/frontend/shadcn' },
                    { text: 'Theming', link: '/frontend/theming' },
                ],
            },
            {
                text: 'Testing',
                items: [
                    { text: 'Overview', link: '/testing/' },
                ],
            },
            {
                text: 'Tooling',
                items: [
                    { text: 'Overview', link: '/tooling/' },
                    { text: 'MCP Servers', link: '/tooling/mcp-servers' },
                    { text: 'Developer Tools', link: '/tooling/developer-tools' },
                    { text: 'Git Hooks', link: '/tooling/git-hooks' },
                    { text: 'Static Analysis', link: '/tooling/static-analysis' },
                ],
            },
            {
                text: 'Database',
                items: [
                    { text: 'Overview', link: '/database/' },
                ],
            },
            {
                text: 'Authentication',
                items: [
                    { text: 'Overview', link: '/authentication/' },
                ],
            },
            {
                text: 'Authorization',
                items: [
                    { text: 'Overview', link: '/authorization/' },
                ],
            },
            {
                text: 'API',
                items: [
                    { text: 'Overview', link: '/api/' },
                ],
            },
            {
                text: 'Queue',
                items: [
                    { text: 'Overview', link: '/queue/' },
                ],
            },
            {
                text: 'Search',
                items: [
                    { text: 'Overview', link: '/search/' },
                ],
            },
            {
                text: 'File Storage',
                items: [
                    { text: 'Overview', link: '/file-storage/' },
                ],
            },
            {
                text: 'Realtime',
                items: [
                    { text: 'Overview', link: '/realtime/' },
                ],
            },
            {
                text: 'Mail',
                items: [
                    { text: 'Overview', link: '/mail/' },
                ],
            },
            {
                text: 'Deployment',
                items: [
                    { text: 'Overview', link: '/deployment/' },
                ],
            },
            {
                text: 'Meta',
                items: [
                    { text: 'Overview', link: '/meta/' },
                    { text: 'Structure Guide', link: '/meta/structure-guide' },
                    { text: 'Authoring Guide', link: '/meta/authoring-guide' },
                ],
            },
        ],
    },
});
