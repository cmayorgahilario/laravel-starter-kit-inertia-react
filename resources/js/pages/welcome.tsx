import { Head, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { app } = usePage().props;

    return (
        <>
            <Head title={app.name} />
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900">{app.name}</h1>
                    <p className="mt-4 text-gray-600">Welcome to your new application.</p>
                </div>
            </div>
        </>
    );
}
