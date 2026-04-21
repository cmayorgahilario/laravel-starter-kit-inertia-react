import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

const meta: Meta<typeof Card> = {
    title: 'UI/Card',
    component: Card,
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
    render: () => (
        <Card className="w-80">
            <CardHeader>
                <CardTitle>Project Alpha</CardTitle>
                <CardDescription>
                    A description of the project and its current status.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>
                    The project is progressing well. All milestones are on
                    track.
                </p>
            </CardContent>
            <CardFooter className="gap-2">
                <Button size="sm">View details</Button>
                <Button size="sm" variant="outline">
                    Archive
                </Button>
            </CardFooter>
        </Card>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-6">
            {/* With action buttons */}
            <Card className="w-80">
                <CardHeader>
                    <CardTitle>With action buttons</CardTitle>
                    <CardDescription>
                        Card with a footer containing primary and secondary
                        actions.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Use this layout when the card requires a definitive user
                        action.
                    </p>
                </CardContent>
                <CardFooter className="gap-2">
                    <Button size="sm">Accept</Button>
                    <Button size="sm" variant="outline">
                        Decline
                    </Button>
                </CardFooter>
            </Card>

            {/* Minimal */}
            <Card className="w-80" size="sm">
                <CardHeader>
                    <CardTitle>Minimal (size sm)</CardTitle>
                    <CardDescription>
                        Compact card with reduced padding, no footer.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Useful for dense list views.
                    </p>
                </CardContent>
            </Card>

            {/* With image slot */}
            <Card className="w-80">
                <div
                    className="flex aspect-video w-full items-center justify-center bg-muted text-sm text-muted-foreground"
                    aria-label="Image placeholder"
                >
                    Image slot (aspect-ratio)
                </div>
                <CardHeader>
                    <CardTitle>With image slot</CardTitle>
                    <CardDescription>
                        First child image fills the top of the card with rounded
                        corners.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Place an &lt;img&gt; as the first child to get the
                        image-slot layout.
                    </p>
                </CardContent>
            </Card>
        </div>
    ),
};
