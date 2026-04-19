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
                    { text: 'Getting Started', link: '/getting-started' },
                    { text: 'App Configuration', link: '/app-configuration' },
                    { text: 'Architecture', link: '/architecture' },
                    { text: 'Frontend Pipeline', link: '/frontend-pipeline' },
                    { text: 'shadcn/ui', link: '/shadcn' },
                    { text: 'Domain Namespaces', link: '/domain-namespaces' },
                    { text: 'Testing', link: '/testing' },
                    { text: 'Static Analysis', link: '/static-analysis' },
                    { text: 'MCP Servers', link: '/mcp-servers' },
                    { text: 'Developer Tools', link: '/developer-tools' },
                ],
            },
            {
                text: 'Meta',
                items: [
                    { text: 'Meta Index', link: '/meta/' },
                    { text: 'Structure Guide', link: '/meta/structure-guide' },
                ],
            },
        ],
    },
});
