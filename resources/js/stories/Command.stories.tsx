import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandSeparator,
    CommandShortcut,
} from '@/components/ui/command';

const meta: Meta<typeof Command> = {
    title: 'UI/Command',
    component: Command,
};

export default meta;

type Story = StoryObj<typeof Command>;

export const Default: Story = {
    render: () => (
        <Command className="w-80 rounded-lg border shadow-md">
            <CommandInput placeholder="Type a command or search…" />
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
                <CommandItem>Calendar</CommandItem>
                <CommandItem>Search Emoji</CommandItem>
                <CommandItem>Calculator</CommandItem>
            </CommandGroup>
        </Command>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <Command className="w-80 rounded-lg border shadow-md">
            <CommandInput placeholder="Search…" />
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Pages">
                <CommandItem>
                    Home
                    <CommandShortcut>⌘H</CommandShortcut>
                </CommandItem>
                <CommandItem>
                    Dashboard
                    <CommandShortcut>⌘D</CommandShortcut>
                </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
                <CommandItem>
                    Profile
                    <CommandShortcut>⌘P</CommandShortcut>
                </CommandItem>
                <CommandItem>
                    Billing
                    <CommandShortcut>⌘B</CommandShortcut>
                </CommandItem>
                <CommandItem data-disabled="true">Disabled item</CommandItem>
            </CommandGroup>
        </Command>
    ),
};
