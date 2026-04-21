import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const meta: Meta<typeof Table> = {
    title: 'UI/Table',
    component: Table,
};

export default meta;

type Story = StoryObj<typeof Table>;

const invoices = [
    { id: 'INV001', status: 'Paid', method: 'Credit Card', amount: '$250.00' },
    { id: 'INV002', status: 'Pending', method: 'PayPal', amount: '$150.00' },
    {
        id: 'INV003',
        status: 'Unpaid',
        method: 'Bank Transfer',
        amount: '$350.00',
    },
];

export const Default: Story = {
    render: () => (
        <Table>
            <TableCaption>A list of recent invoices.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                        <TableCell className="font-medium">
                            {invoice.id}
                        </TableCell>
                        <TableCell>{invoice.status}</TableCell>
                        <TableCell>{invoice.method}</TableCell>
                        <TableCell className="text-right">
                            {invoice.amount}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-8">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>Alice</TableCell>
                        <TableCell>Admin</TableCell>
                        <TableCell>Active</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Bob</TableCell>
                        <TableCell>Editor</TableCell>
                        <TableCell>Inactive</TableCell>
                    </TableRow>
                    <TableRow data-selected="true">
                        <TableCell>Carol</TableCell>
                        <TableCell>Viewer</TableCell>
                        <TableCell>Active</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    ),
};
