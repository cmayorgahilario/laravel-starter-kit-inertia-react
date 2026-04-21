import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

const meta: Meta<typeof Accordion> = {
    title: 'UI/Accordion',
    component: Accordion,
};

export default meta;

type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
    render: () => (
        <Accordion type="single" collapsible className="w-96">
            <AccordionItem value="item-1">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>Is it styled?</AccordionTrigger>
                <AccordionContent>
                    Yes. It comes with default styles that match the other
                    components.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>Is it animated?</AccordionTrigger>
                <AccordionContent>
                    Yes. It's animated by default, but you can disable it if you
                    prefer.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-8">
            <div>
                <p className="mb-2 text-sm text-muted-foreground">
                    Single (collapsible)
                </p>
                <Accordion
                    type="single"
                    collapsible
                    defaultValue="item-1"
                    className="w-96"
                >
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Section One</AccordionTrigger>
                        <AccordionContent>
                            Content for section one.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Section Two</AccordionTrigger>
                        <AccordionContent>
                            Content for section two.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
            <div>
                <p className="mb-2 text-sm text-muted-foreground">
                    Multiple open
                </p>
                <Accordion
                    type="multiple"
                    defaultValue={['item-1', 'item-2']}
                    className="w-96"
                >
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Open by default</AccordionTrigger>
                        <AccordionContent>
                            This is open by default.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Also open</AccordionTrigger>
                        <AccordionContent>
                            Multiple items can be open simultaneously.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Closed</AccordionTrigger>
                        <AccordionContent>This one is closed.</AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    ),
};
