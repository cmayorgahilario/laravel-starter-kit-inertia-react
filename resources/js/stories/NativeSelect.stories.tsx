import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    NativeSelect,
    NativeSelectOption,
    NativeSelectOptGroup,
} from '@/components/ui/native-select';

const meta: Meta<typeof NativeSelect> = {
    title: 'UI/NativeSelect',
    component: NativeSelect,
};

export default meta;

type Story = StoryObj<typeof NativeSelect>;

export const Default: Story = {
    render: () => (
        <NativeSelect className="w-48">
            <NativeSelectOption value="">Select option…</NativeSelectOption>
            <NativeSelectOption value="a">Option A</NativeSelectOption>
            <NativeSelectOption value="b">Option B</NativeSelectOption>
            <NativeSelectOption value="c">Option C</NativeSelectOption>
        </NativeSelect>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <NativeSelect className="w-48">
                <NativeSelectOption value="a">Default size</NativeSelectOption>
                <NativeSelectOption value="b">Option B</NativeSelectOption>
            </NativeSelect>
            <NativeSelect size="sm" className="w-48">
                <NativeSelectOption value="a">Small size</NativeSelectOption>
                <NativeSelectOption value="b">Option B</NativeSelectOption>
            </NativeSelect>
            <NativeSelect disabled className="w-48">
                <NativeSelectOption value="a">Disabled</NativeSelectOption>
            </NativeSelect>
            <NativeSelect className="w-48">
                <NativeSelectOptGroup label="Group A">
                    <NativeSelectOption value="a1">
                        Option A1
                    </NativeSelectOption>
                    <NativeSelectOption value="a2">
                        Option A2
                    </NativeSelectOption>
                </NativeSelectOptGroup>
                <NativeSelectOptGroup label="Group B">
                    <NativeSelectOption value="b1">
                        Option B1
                    </NativeSelectOption>
                    <NativeSelectOption value="b2">
                        Option B2
                    </NativeSelectOption>
                </NativeSelectOptGroup>
            </NativeSelect>
        </div>
    ),
};
