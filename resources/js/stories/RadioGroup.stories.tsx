import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const meta: Meta<typeof RadioGroup> = {
    title: 'UI/RadioGroup',
    component: RadioGroup,
};

export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
    render: () => (
        <RadioGroup defaultValue="option1">
            <div className="flex items-center gap-2">
                <RadioGroupItem value="option1" id="r1" />
                <Label htmlFor="r1">Option 1</Label>
            </div>
            <div className="flex items-center gap-2">
                <RadioGroupItem value="option2" id="r2" />
                <Label htmlFor="r2">Option 2</Label>
            </div>
            <div className="flex items-center gap-2">
                <RadioGroupItem value="option3" id="r3" />
                <Label htmlFor="r3">Option 3</Label>
            </div>
        </RadioGroup>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-6">
            <RadioGroup defaultValue="a">
                <div className="flex items-center gap-2">
                    <RadioGroupItem value="a" id="ra" />
                    <Label htmlFor="ra">Checked</Label>
                </div>
                <div className="flex items-center gap-2">
                    <RadioGroupItem value="b" id="rb" />
                    <Label htmlFor="rb">Unchecked</Label>
                </div>
            </RadioGroup>
            <RadioGroup defaultValue="d" disabled>
                <div className="flex items-center gap-2">
                    <RadioGroupItem value="c" id="rc" />
                    <Label htmlFor="rc">Disabled unchecked</Label>
                </div>
                <div className="flex items-center gap-2">
                    <RadioGroupItem value="d" id="rd" />
                    <Label htmlFor="rd">Disabled checked</Label>
                </div>
            </RadioGroup>
        </div>
    ),
};
