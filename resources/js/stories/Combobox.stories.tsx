import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from '@/components/ui/combobox';

const meta: Meta<typeof Combobox> = {
    title: 'UI/Combobox',
    component: Combobox,
};

export default meta;

type Story = StoryObj<typeof Combobox>;

const fruits = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'date', label: 'Date' },
    { value: 'elderberry', label: 'Elderberry' },
];

export const Default: Story = {
    render: () => (
        <Combobox className="w-64">
            <ComboboxInput placeholder="Search fruits…" />
            <ComboboxContent>
                <ComboboxList>
                    {fruits.map((fruit) => (
                        <ComboboxItem key={fruit.value} value={fruit.value}>
                            {fruit.label}
                        </ComboboxItem>
                    ))}
                </ComboboxList>
                <ComboboxEmpty>No fruit found.</ComboboxEmpty>
            </ComboboxContent>
        </Combobox>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <div>
                <p className="mb-2 text-sm text-muted-foreground">Default</p>
                <Combobox className="w-64">
                    <ComboboxInput placeholder="Search…" />
                    <ComboboxContent>
                        <ComboboxList>
                            {fruits.map((f) => (
                                <ComboboxItem key={f.value} value={f.value}>
                                    {f.label}
                                </ComboboxItem>
                            ))}
                        </ComboboxList>
                        <ComboboxEmpty>No results.</ComboboxEmpty>
                    </ComboboxContent>
                </Combobox>
            </div>
            <div>
                <p className="mb-2 text-sm text-muted-foreground">
                    With pre-selected value
                </p>
                <Combobox defaultValue="banana" className="w-64">
                    <ComboboxInput placeholder="Search…" />
                    <ComboboxContent>
                        <ComboboxList>
                            {fruits.map((f) => (
                                <ComboboxItem key={f.value} value={f.value}>
                                    {f.label}
                                </ComboboxItem>
                            ))}
                        </ComboboxList>
                        <ComboboxEmpty>No results.</ComboboxEmpty>
                    </ComboboxContent>
                </Combobox>
            </div>
        </div>
    ),
};
