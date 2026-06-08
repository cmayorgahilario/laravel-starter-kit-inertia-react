<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Boost Master Switch
    |--------------------------------------------------------------------------
    |
    | This option may be used to disable all Boost functionality - which
    | will prevent Boost's routes from being registered and will also
    | disable Boost's browser logging functionality from operating.
    |
    */

    'enabled' => env('BOOST_ENABLED', true),

    /*
    |--------------------------------------------------------------------------
    | Boost Browser Logs Watcher
    |--------------------------------------------------------------------------
    |
    | The following option may be used to enable or disable the browser logs
    | watcher feature within Laravel Boost. The log watcher will read any
    | errors within the browser's console to give Boost better context.
    |
    */

    'browser_logs_watcher' => env('BOOST_BROWSER_LOGS_WATCHER', true),

    /*
    |--------------------------------------------------------------------------
    | Boost Executables Paths
    |--------------------------------------------------------------------------
    |
    | These options allow you to specify custom paths for the executables that
    | Boost uses. When configured, they take precedence over the automatic
    | discovery mechanism. Leave empty to use defaults from your $PATH.
    |
    */

    'executable_paths' => [
        'php' => env('BOOST_PHP_EXECUTABLE_PATH'),
        'composer' => env('BOOST_COMPOSER_EXECUTABLE_PATH'),
        'npm' => env('BOOST_NPM_EXECUTABLE_PATH'),
        'vendor_bin' => env('BOOST_VENDOR_BIN_EXECUTABLE_PATH'),
        'current_directory' => env('BOOST_CURRENT_DIRECTORY_EXECUTABLE_PATH'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Per-agent Guidelines Path
    |--------------------------------------------------------------------------
    |
    | Boost re-injects its auto-generated guidelines block on every
    | `boost:update` (run by composer's post-update-cmd). By default it writes
    | that block into each agent's root file (CLAUDE.md, AGENTS.md), which
    | collides with our curated documentation system (AGENTS.md + docs/).
    |
    | We redirect every agent's guidelines to a single, dedicated, gitignored
    | file so the curated files stay clean. The `documentation-maintenance`
    | skill (BOOST-SYNC mode) reads this file, distills what is new and
    | important, and folds it into AGENTS.md / docs/ — see
    | `.ai/skills/documentation-maintenance/references/boost-sync.md`.
    |
    */

    'agents' => [
        'claude_code' => ['guidelines_path' => '.ai/boost-guidelines.md'],
        'junie' => ['guidelines_path' => '.ai/boost-guidelines.md'],
        'codex' => ['guidelines_path' => '.ai/boost-guidelines.md'],
        'opencode' => ['guidelines_path' => '.ai/boost-guidelines.md'],
    ],

];
