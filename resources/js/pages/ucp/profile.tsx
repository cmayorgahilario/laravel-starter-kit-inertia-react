import { Form, Head, router, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import type { ChangeEvent, ReactNode } from 'react';
import { toast } from 'sonner';

import { DeleteAccount } from '@/components/delete-account';
import { TextLink } from '@/components/text-link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import UcpLayout from '@/layouts/ucp-layout';
import { destroy as destroyPhoto } from '@/routes/profile-photo';
import { update } from '@/routes/user-profile-information';
import { send } from '@/routes/verification';
import type { SharedData } from '@/types';

export default function UcpProfile() {
    const { auth } = usePage<SharedData>().props;
    const getInitials = useInitials();
    const photoInput = useRef<HTMLInputElement>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const user = auth.user;

    if (!user) {
        return null;
    }

    const onPhotoSelected = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const deletePhoto = () => {
        router.delete(destroyPhoto.url(), {
            preserveScroll: true,
            onSuccess: () => {
                setPhotoPreview(null);

                if (photoInput.current) {
                    photoInput.current.value = '';
                }

                toast.success('Profile photo removed.');
            },
        });
    };

    return (
        <>
            <Head title="Profile" />

            <div className="flex flex-col gap-8">
                <Card>
                    <CardHeader className="border-b">
                        <CardTitle>Profile information</CardTitle>
                        <CardDescription>Update your name, email and profile photo.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={update.url()}
                            method="put"
                            onSuccess={() => {
                                setPhotoPreview(null);
                                toast.success('Profile updated.');
                            }}
                            className="flex flex-col gap-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="flex items-center gap-5">
                                        <Avatar className="size-16">
                                            <AvatarImage src={photoPreview ?? user.avatar_url} alt={user.name} />
                                            <AvatarFallback className="text-base">
                                                {getInitials(user.name)}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex flex-col gap-2">
                                            <input
                                                ref={photoInput}
                                                type="file"
                                                name="photo"
                                                accept="image/jpeg,image/png,image/webp"
                                                className="hidden"
                                                onChange={onPhotoSelected}
                                            />
                                            <div className="flex flex-wrap gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => photoInput.current?.click()}
                                                >
                                                    Change photo
                                                </Button>
                                                <Button type="button" variant="ghost" size="sm" onClick={deletePhoto}>
                                                    Remove
                                                </Button>
                                            </div>
                                            <p className="text-xs text-muted-foreground">JPG, PNG or WebP. Max 2 MB.</p>
                                            {errors.photo ? <FieldError>{errors.photo}</FieldError> : null}
                                        </div>
                                    </div>

                                    <FieldGroup className="gap-5">
                                        <Field data-invalid={errors.name ? true : undefined}>
                                            <FieldLabel htmlFor="name">Full name</FieldLabel>
                                            <Input
                                                id="name"
                                                name="name"
                                                defaultValue={user.name}
                                                autoComplete="name"
                                                required
                                                aria-invalid={errors.name ? true : undefined}
                                            />
                                            {errors.name ? <FieldError>{errors.name}</FieldError> : null}
                                        </Field>

                                        <Field data-invalid={errors.email ? true : undefined}>
                                            <FieldLabel htmlFor="email">Email</FieldLabel>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                defaultValue={user.email}
                                                autoComplete="email"
                                                required
                                                aria-invalid={errors.email ? true : undefined}
                                            />
                                            {errors.email ? <FieldError>{errors.email}</FieldError> : null}
                                            {user.email_verified_at === null ? (
                                                <FieldDescription>
                                                    Your email is not verified.{' '}
                                                    <TextLink href={send.url()} method="post" as="button">
                                                        Resend verification
                                                    </TextLink>
                                                    .
                                                </FieldDescription>
                                            ) : null}
                                        </Field>
                                    </FieldGroup>

                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={processing}>
                                            {processing ? <Spinner data-icon="inline-start" /> : null}
                                            Save changes
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>

                <DeleteAccount />
            </div>
        </>
    );
}

UcpProfile.layout = (page: ReactNode) => (
    <AppLayout>
        <UcpLayout>{page}</UcpLayout>
    </AppLayout>
);
