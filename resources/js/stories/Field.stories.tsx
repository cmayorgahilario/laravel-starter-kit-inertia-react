import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    Field,
    FieldLabel,
    FieldDescription,
    FieldError,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

const meta: Meta<typeof Field> = {
    title: 'UI/Field',
    component: Field,
};

export default meta;

type Story = StoryObj<typeof Field>;

export const Default: Story = {
    render: () => (
        <Field className="w-80">
            <FieldLabel>Email address</FieldLabel>
            <Input type="email" placeholder="you@example.com" />
            <FieldDescription>We'll never share your email.</FieldDescription>
        </Field>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex w-80 flex-col gap-6">
            <Field>
                <FieldLabel>Default field</FieldLabel>
                <Input placeholder="Enter value" />
                <FieldDescription>Helper text appears here.</FieldDescription>
            </Field>
            <Field>
                <FieldLabel>With error</FieldLabel>
                <Input placeholder="Enter value" aria-invalid={true} />
                <FieldError>This field is required.</FieldError>
            </Field>
            <Field>
                <FieldLabel>Disabled</FieldLabel>
                <Input placeholder="Disabled" disabled />
                <FieldDescription>
                    This field cannot be edited.
                </FieldDescription>
            </Field>
        </div>
    ),
};
