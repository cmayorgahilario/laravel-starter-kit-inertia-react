import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';

const meta: Meta<typeof Calendar> = {
    title: 'UI/Calendar',
    component: Calendar,
};

export default meta;

type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
    render: () => {
        const [date, setDate] = useState<Date | undefined>(new Date());
        return (
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
            />
        );
    },
};

export const AllVariants: Story = {
    render: () => {
        const [single, setSingle] = useState<Date | undefined>(new Date());
        const [range, setRange] = useState<DateRange | undefined>({
            from: new Date(),
            to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        return (
            <div className="flex flex-wrap gap-6">
                <div>
                    <p className="mb-2 text-sm text-muted-foreground">
                        Single selection
                    </p>
                    <Calendar
                        mode="single"
                        selected={single}
                        onSelect={setSingle}
                        className="rounded-md border"
                    />
                </div>
                <div>
                    <p className="mb-2 text-sm text-muted-foreground">
                        Range selection
                    </p>
                    <Calendar
                        mode="range"
                        selected={range}
                        onSelect={setRange}
                        className="rounded-md border"
                    />
                </div>
            </div>
        );
    },
};
