/** @type {import('@commitlint/types').UserConfig} */
export default {
    extends: ['@commitlint/config-conventional'],

    rules: {
        // Allowed commit types
        'type-enum': [
            2,
            'always',
            [
                // --- Core Conventional Types ---
                'feat', // New feature
                'fix', // Bug fix
                'docs', // Documentation changes
                'style', // Code formatting (no logic changes)
                'refactor', // Code restructuring (no feature/bug fix)
                'perf', // Performance improvements
                'test', // Add or update tests
                'build', // Build system or dependencies
                'ci', // CI/CD configuration or scripts
                'chore', // Maintenance tasks
                'revert', // Reverting a previous commit

                // --- Optional / Extended Types ---
                'config', // Configuration file changes (env, settings, linter)
                'security', // Security fixes (vulnerabilities, patches)
                'release', // Version bump and changelog updates
            ],
        ],

        // Subject and type must not be empty
        'type-empty': [2, 'never'],
        'subject-empty': [2, 'never'],

        // Length rules (long titles allowed: header and subject aligned to 150)
        'header-max-length': [2, 'always', 150],
        'subject-max-length': [2, 'always', 150],
        'body-max-line-length': [2, 'always', 250],

        // Case rules
        'type-case': [2, 'always', 'lower-case'],
        'scope-case': [2, 'always', 'lower-case'],

        // Subject case: allow lower-case and sentence-case.
        // camel/kebab/snake are intentionally NOT forbidden: a single-word
        // subject (e.g. "fix: typo") is indistinguishable from those cases
        // and would be rejected as a false positive.
        'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],

        // Optional: enforce blank line between header and body
        'body-leading-blank': [1, 'always'],
    },
};
