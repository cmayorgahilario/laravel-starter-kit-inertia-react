import { Head, router, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { auth, app } = usePage().props;

    function logout() {
        router.post('/logout');
    }

    return (
        <>
            <Head title={`Dashboard — ${app.name}`} />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{app.name}</h1>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600 dark:text-gray-400">{auth.user?.name}</span>
                            <button
                                type="button"
                                onClick={logout}
                                className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            >
                                Log out
                            </button>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Welcome back, <strong className="text-gray-800 dark:text-gray-200">{auth.user?.name}</strong>!
                        </p>
                    </div>
                </main>
            </div>
        </>
    );
}
