import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Appearance, applyTheme, setAppearanceCookie } from '../../lib/appearance';
import SettingsLayout from '../../layouts/settings-layout';

type ThemeOption = {
    value: Appearance;
    label: string;
    description: string;
    icon: string;
};

const THEME_OPTIONS: ThemeOption[] = [
    { value: 'light', label: 'Light', description: 'Always use the light theme', icon: '☀️' },
    { value: 'dark', label: 'Dark', description: 'Always use the dark theme', icon: '🌙' },
    { value: 'system', label: 'System', description: 'Follow your system preference', icon: '💻' },
];

export default function AppearancePage() {
    const { appearance: serverAppearance } = usePage().props;
    const [appearance, setAppearance] = useState<Appearance>(serverAppearance || 'system');

    useEffect(() => {
        applyTheme(appearance);
    }, [appearance]);

    function choose(value: Appearance) {
        setAppearanceCookie(value);
        setAppearance(value);
    }

    const current = appearance === '' ? 'system' : appearance;

    return (
        <SettingsLayout title="Appearance">
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                Choose how the interface looks to you.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {THEME_OPTIONS.map(option => {
                    const isSelected = current === option.value;
                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => choose(option.value)}
                            className={`flex flex-col items-center gap-3 rounded-xl border-2 p-6 text-center transition-colors ${
                                isSelected
                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-gray-600 dark:hover:bg-gray-700/50'
                            }`}
                        >
                            <span className="text-3xl">{option.icon}</span>
                            <div>
                                <p
                                    className={`text-sm font-semibold ${
                                        isSelected
                                            ? 'text-indigo-700 dark:text-indigo-400'
                                            : 'text-gray-900 dark:text-white'
                                    }`}
                                >
                                    {option.label}
                                </p>
                                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{option.description}</p>
                            </div>
                            {isSelected && (
                                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">✓ Active</span>
                            )}
                        </button>
                    );
                })}
            </div>
        </SettingsLayout>
    );
}
