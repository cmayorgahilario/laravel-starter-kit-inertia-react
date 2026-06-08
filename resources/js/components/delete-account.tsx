import { Form } from '@inertiajs/react';

import { destroy } from '@/actions/App/Http/Controllers/Security/DeleteAccountController';
import { PasswordInput } from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';

export function DeleteAccount() {
    return (
        <Card className="ring-destructive/20">
            <CardHeader className="border-b border-destructive/20">
                <CardTitle className="text-destructive">Danger zone</CardTitle>
                <CardDescription>
                    Deleting your account permanently erases all your data. This action cannot be undone.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Dialog>
                    <DialogTrigger render={<Button variant="destructive" />}>Delete my account</DialogTrigger>
                    <DialogContent>
                        <Form
                            action={destroy.url()}
                            method="delete"
                            errorBag="deleteAccount"
                            resetOnSuccess={['password']}
                            className="flex flex-col gap-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <DialogHeader>
                                        <DialogTitle>Delete your account?</DialogTitle>
                                        <DialogDescription>
                                            This action is permanent. Enter your password to confirm you want to delete
                                            your account and all its data.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <Field data-invalid={errors.password ? true : undefined}>
                                        <FieldLabel htmlFor="delete_password">Password</FieldLabel>
                                        <PasswordInput
                                            id="delete_password"
                                            name="password"
                                            autoComplete="current-password"
                                            required
                                            aria-invalid={errors.password ? true : undefined}
                                            placeholder="••••••••"
                                        />
                                        {errors.password ? <FieldError>{errors.password}</FieldError> : null}
                                    </Field>

                                    <DialogFooter>
                                        <DialogClose render={<Button variant="outline" type="button" />}>
                                            Cancel
                                        </DialogClose>
                                        <Button type="submit" variant="destructive" disabled={processing}>
                                            {processing ? <Spinner data-icon="inline-start" /> : null}
                                            Delete account
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
