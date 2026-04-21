import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink,
} from '@/components/ui/navigation-menu';

const meta: Meta<typeof NavigationMenu> = {
    title: 'UI/NavigationMenu',
    component: NavigationMenu,
};

export default meta;

type Story = StoryObj<typeof NavigationMenu>;

export const Default: Story = {
    render: () => (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>
                        Getting started
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <div className="flex w-48 flex-col gap-1 p-4">
                            <NavigationMenuLink href="#">
                                Introduction
                            </NavigationMenuLink>
                            <NavigationMenuLink href="#">
                                Installation
                            </NavigationMenuLink>
                            <NavigationMenuLink href="#">
                                Quickstart
                            </NavigationMenuLink>
                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink href="#">
                        Documentation
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <div className="flex w-48 flex-col gap-1 p-4">
                            <NavigationMenuLink href="#">
                                Product A
                            </NavigationMenuLink>
                            <NavigationMenuLink href="#">
                                Product B
                            </NavigationMenuLink>
                            <NavigationMenuLink href="#">
                                Product C
                            </NavigationMenuLink>
                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Company</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <div className="flex w-48 flex-col gap-1 p-4">
                            <NavigationMenuLink href="#">
                                About
                            </NavigationMenuLink>
                            <NavigationMenuLink href="#">
                                Blog
                            </NavigationMenuLink>
                            <NavigationMenuLink href="#">
                                Careers
                            </NavigationMenuLink>
                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink href="#">Pricing</NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    ),
};
