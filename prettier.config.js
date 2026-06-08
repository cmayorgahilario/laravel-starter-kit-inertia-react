/** @type {import('prettier').Config} */
export default {
    // Base style (matches the existing code: 4 spaces, single quotes).
    semi: true,
    singleQuote: true,
    trailingComma: 'all',
    tabWidth: 4,
    printWidth: 120,
    endOfLine: 'lf',

    // Chisel formats Laravel Blade markup (Pint owns the PHP, not the template).
    // prettier-plugin-tailwindcss must remain LAST so it sorts classes after
    // every other plugin (including Blade) has produced its output.
    plugins: ['prettier-plugin-blade', 'prettier-plugin-tailwindcss'],

    // Tailwind 4 no longer uses tailwind.config.js; the CSS entrypoint defines the theme.
    tailwindStylesheet: 'resources/css/app.css',

    // Also sort classes passed to these helpers (tailwind-merge / cva).
    tailwindFunctions: ['clsx', 'cn', 'cva'],

    overrides: [
        // Blade templates: use Chisel's parser. PHP fragments are left untouched
        // (no @prettier/plugin-php) so Pint stays the single source of truth for PHP.
        {
            files: '*.blade.php',
            options: {
                parser: 'blade',
                bladePhpFormatting: 'off',
                bladeKeepHeadAndBodyAtRoot: false,
                // Keep the readable space on control structures (@if ($x), @foreach ...),
                // but glue the paren on directives like @vite(...) and @class(...).
                bladeDirectiveArgSpacing: 'space',
                bladeDirectiveArgSpacingOverrides: [
                    'if',
                    'elseif',
                    'unless',
                    'while',
                    'for',
                    'foreach',
                    'forelse',
                    'switch',
                    'case',
                    'vite=none',
                    'class=none',
                ],
            },
        },

        // YAML uses 2 spaces by convention (docker-compose, CI, etc.).
        {
            files: '**/*.{yml,yaml}',
            options: { tabWidth: 2 },
        },
    ],
};
