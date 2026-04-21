import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const meta: Meta<typeof Dialog> = {
    title: 'UI/Dialog',
    component: Dialog,
};

export default meta;

type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
    render: () => (
        <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>
                Open Dialog
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm action</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. Are you sure you want to
                        continue?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter showCloseButton>
                    <Button>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-wrap gap-4">
            <Dialog>
                <DialogTrigger render={<Button variant="outline" />}>
                    Simple dialog
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Simple dialog</DialogTitle>
                        <DialogDescription>
                            A basic dialog with a title and description.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter showCloseButton>
                        <Button>OK</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog>
                <DialogTrigger render={<Button />}>
                    Dialog with form
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Update your display name below.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-2">
                        <Input placeholder="Display name" />
                    </div>
                    <DialogFooter showCloseButton>
                        <Button>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    ),
};
