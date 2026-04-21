import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const meta: Meta<typeof Select> = {
    title: 'UI/Select',
    component: Select,
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {
    render: () => (
        <Select>
            <SelectTrigger className="w-48">
                <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="cherry">Cherry</SelectItem>
                <SelectItem value="date">Date</SelectItem>
            </SelectContent>
        </Select>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <div>
                <p className="mb-2 text-sm text-muted-foreground">
                    Default size
                </p>
                <Select defaultValue="apple">
                    <SelectTrigger className="w-48">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="cherry">Cherry</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <p className="mb-2 text-sm text-muted-foreground">Small size</p>
                <Select>
                    <SelectTrigger size="sm" className="w-48">
                        <SelectValue placeholder="Select…" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="a">Option A</SelectItem>
                        <SelectItem value="b">Option B</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <p className="mb-2 text-sm text-muted-foreground">
                    With groups
                </p>
                <Select>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Americas</SelectLabel>
                            <SelectItem value="est">Eastern (EST)</SelectItem>
                            <SelectItem value="pst">Pacific (PST)</SelectItem>
                        </SelectGroup>
                        <SelectSeparator />
                        <SelectGroup>
                            <SelectLabel>Europe</SelectLabel>
                            <SelectItem value="gmt">GMT</SelectItem>
                            <SelectItem value="cet">Central (CET)</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    ),
};
