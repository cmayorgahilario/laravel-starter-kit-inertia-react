import { defineConfig } from 'vitepress'

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
})
