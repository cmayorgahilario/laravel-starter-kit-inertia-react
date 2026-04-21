import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

const meta: Meta<typeof Sheet> = {
    title: 'UI/Sheet',
    component: Sheet,
};

export default meta;

type Story = StoryObj<typeof Sheet>;

export const Default: Story = {
    render: () => (
        <Sheet>
            <SheetTrigger render={<Button variant="outline" />}>
                Open Sheet
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Edit profile</SheetTitle>
                    <SheetDescription>
                        Make changes to your profile. Click save when done.
                    </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-4 py-4">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="sheet-name">Name</Label>
                        <Input id="sheet-name" placeholder="Your name" />
                    </div>
                </div>
                <SheetFooter>
                    <Button>Save changes</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-wrap gap-4">
            {(['right', 'left', 'top', 'bottom'] as const).map((side) => (
                <Sheet key={side}>
                    <SheetTrigger render={<Button variant="outline" />}>
                        {side}
                    </SheetTrigger>
                    <SheetContent side={side}>
                        <SheetHeader>
                            <SheetTitle>Sheet — {side}</SheetTitle>
                            <SheetDescription>
                                This sheet slides in from the {side}.
                            </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            ))}
        </div>
    ),
};
