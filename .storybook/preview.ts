import type { Preview } from '@storybook/react-vite';
import { withThemeByClassName } from '@storybook/addon-themes';
import '../resources/css/app.css';

const preview: Preview = {
    parameters: {
        backgrounds: {
            disable: true,
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
    decorators: [
        withThemeByClassName({
            themes: {
                light: '',
                dark: 'dark',
            },
            defaultTheme: 'light',
            parentSelector: 'html',
        }),
        (Story, { globals }) => {
            document.documentElement.style.colorScheme = globals.theme === 'dark' ? 'dark' : 'light';
            return Story();
        },
    ],
};

export default preview;
