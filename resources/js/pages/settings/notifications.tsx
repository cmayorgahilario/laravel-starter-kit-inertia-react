import type { PageProps } from '@inertiajs/core';
import { Head, useForm, usePage } from '@inertiajs/react';
import { SubmitEvent } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { NotificationPreferences } from '@/types/notifications';

interface NotificationsPageProps extends PageProps {
    preferences: NotificationPreferences;
    status?: string;
}

export default function Notifications() {
    const { flash } = usePage().props;
    const { preferences, status } = usePage<NotificationsPageProps>().props;

    const { data, setData, patch, processing, errors } = useForm({
        preferences: {
            email: preferences.email ?? true,
        } as NotificationPreferences,
    });

    function submit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        patch('/settings/notifications', { preserveScroll: true });
    }

    function togglePreference(key: string, value: boolean) {
        setData('preferences', { ...data.preferences, [key]: value });
    }

    const showStatus =
        flash.status === 'notifications-updated' ||
        status === 'notifications-updated';

    return (
        <>
            <Head title="Notification settings" />

            <h1 className="sr-only">Notification settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Notifications"
                    description="Choose which email notifications you want to receive"
                />

                {showStatus && (
                    <p className="text-sm font-medium text-green-600">
                        Notification preferences saved.
                    </p>
                )}

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-4">
                        <Label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                            Email notifications
                        </Label>

                        <Label
                            htmlFor="notifications-email"
                            className="flex cursor-pointer items-start gap-4 rounded-lg border border-border p-4 hover:bg-muted/50"
                        >
                            <Checkbox
                                id="notifications-email"
                                checked={data.preferences.email ?? true}
                                onCheckedChange={(checked) =>
                                    togglePreference('email', checked === true)
                                }
                                className="mt-0.5"
                            />
                            <div className="flex-1 space-y-1 leading-tight">
                                <p className="text-sm font-medium text-foreground">
                                    Email notifications
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Receive important account updates and
                                    security alerts via email.
                                </p>
                            </div>
                        </Label>
                    </div>

                    <InputError message={errors.preferences} />

                    <div className="flex items-center gap-4">
                        <Button
                            type="submit"
                            disabled={processing}
                            data-test="save-notifications-button"
                        >
                            Save preferences
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
