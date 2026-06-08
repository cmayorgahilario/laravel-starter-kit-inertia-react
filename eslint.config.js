import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import prettier from 'eslint-config-prettier/flat';
import importPlugin from 'eslint-plugin-import-x';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import typescript from 'typescript-eslint';

// Statements that get a blank line before and after (readability).
const controlStatements = ['if', 'return', 'for', 'while', 'do', 'switch', 'try', 'throw'];
const paddingAroundControl = controlStatements.flatMap((stmt) => [
    { blankLine: 'always', prev: '*', next: stmt },
    { blankLine: 'always', prev: stmt, next: '*' },
]);

export default typescript.config(
    // Global ignores (replaces .eslintignore, which no longer exists in flat config).
    {
        ignores: [
            'vendor',
            'node_modules',
            'public',
            'bootstrap/ssr',
            'storage',
            'resources/js/types/vite-env.d.ts',
            // Generated folders (shadcn/ui, Laravel Wayfinder) — not linted.
            'resources/js/components/ui/**',
            'resources/js/actions/**',
            'resources/js/routes/**',
            'resources/js/wayfinder/**',
        ],
    },

    // Recommended JS baseline for all files.
    js.configs.recommended,

    // ── Application code (type-aware) ──────────────────────────────────────
    {
        files: ['resources/js/**/*.{ts,tsx}'],
        extends: [
            ...typescript.configs.recommendedTypeChecked,
            ...typescript.configs.stylisticTypeChecked,
            reactHooks.configs.flat['recommended-latest'],
            react.configs.flat.recommended,
            react.configs.flat['jsx-runtime'],
        ],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
            globals: {
                ...globals.browser,
            },
        },
        plugins: {
            'import-x': importPlugin,
        },
        settings: {
            // Pinned version (not 'detect'): avoids an eslint-plugin-react bug with ESLint 10.
            react: { version: '19.2' },
            'import-x/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                    project: './tsconfig.json',
                },
                node: true,
            },
        },
        rules: {
            // React 19: no need to import React or declare prop-types.
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'react/no-unescaped-entities': 'off',

            // TypeScript.
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/consistent-type-imports': [
                'error',
                { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
            ],

            // Import ordering and style.
            'import-x/order': [
                'error',
                {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                    'newlines-between': 'always',
                    alphabetize: { order: 'asc', caseInsensitive: true },
                },
            ],
            'import-x/consistent-type-specifier-style': ['error', 'prefer-top-level'],
        },
    },

    // ── Configuration files (without type information) ─────────────────────
    {
        files: ['**/*.{js,mjs,cjs}', '*.config.ts', 'vite.config.ts'],
        extends: [typescript.configs.disableTypeChecked],
        languageOptions: {
            globals: { ...globals.node },
        },
    },

    // Turns off all formatting rules that conflict with Prettier.
    prettier,

    // ── Opinionated stylistic rules we DO enforce (on top of Prettier) ──────
    {
        files: ['resources/js/**/*.{ts,tsx}'],
        plugins: { '@stylistic': stylistic },
        rules: {
            curly: ['error', 'all'],
            '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: false }],
            '@stylistic/padding-line-between-statements': ['error', ...paddingAroundControl],
        },
    },
);
