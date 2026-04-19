import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Menu, Search } from 'lucide-react';

import AppLogo from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { UserMenuContent } from '@/components/user-menu-content';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useInitials } from '@/hooks/use-initials';
import { cn, toUrl } from '@/lib/utils';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, NavItem } from '@/types';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const rightNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

const activeItemStyles = 'text-foreground';

export function AppHeader({ breadcrumbs = [] }: Props) {
    const page = usePage();
    const { auth } = page.props;
    const getInitials = useInitials();
    const { isCurrentUrl, whenCurrentUrl } = useCurrentUrl();

    return (
        <>
            <div className="border-border/60 bg-background/80 sticky top-0 z-30 border-b backdrop-blur-md backdrop-saturate-150">
                <div className="mx-auto flex h-16 items-center gap-3 px-4 md:max-w-7xl md:gap-4 md:px-6">
                    {/* Mobile Menu */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger
                                render={
                                    <Button variant="ghost" size="icon" className="-ml-1 size-9">
                                        <Menu className="size-5" />
                                    </Button>
                                }
                            />
                            <SheetContent
                                side="left"
                                className="bg-sidebar flex h-full w-72 flex-col items-stretch justify-between gap-0 p-0"
                            >
                                <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                                <SheetHeader className="border-sidebar-border/60 flex h-14 flex-row items-center justify-start border-b px-5 text-left">
                                    <AppLogoIcon className="text-sidebar-foreground size-6 fill-current" />
                                </SheetHeader>
                                <div className="flex flex-1 flex-col justify-between p-3 text-sm">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sidebar-foreground/60 px-3 py-2 text-[11px] font-medium tracking-[0.08em] uppercase">
                                            Platform
                                        </p>
                                        {mainNavItems.map((item) => (
                                            <Link
                                                key={item.title}
                                                href={item.href}
                                                className="text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-3 rounded-md px-3 py-2 font-medium transition-colors"
                                            >
                                                {item.icon && <item.icon className="size-4" />}
                                                <span>{item.title}</span>
                                            </Link>
                                        ))}
                                    </div>

                                    <div className="border-sidebar-border/60 flex flex-col gap-1 border-t pt-3">
                                        {rightNavItems.map((item) => (
                                            <a
                                                key={item.title}
                                                href={toUrl(item.href)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors"
                                            >
                                                {item.icon && <item.icon className="size-4" />}
                                                <span>{item.title}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link href={dashboard()} prefetch className="flex items-center gap-2">
                        <AppLogo />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="ml-6 hidden h-full items-center gap-1 lg:flex">
                        <NavigationMenu className="flex h-full items-stretch">
                            <NavigationMenuList className="flex h-full items-stretch gap-1">
                                {mainNavItems.map((item, index) => (
                                    <NavigationMenuItem
                                        key={index}
                                        className="relative flex h-full items-center"
                                    >
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                'text-muted-foreground hover:text-foreground h-9 cursor-pointer bg-transparent px-3 text-sm font-medium transition-colors',
                                                whenCurrentUrl(item.href, activeItemStyles),
                                            )}
                                        >
                                            {item.icon && <item.icon className="mr-2 size-4" />}
                                            {item.title}
                                        </Link>
                                        {isCurrentUrl(item.href) && (
                                            <span
                                                aria-hidden
                                                className="bg-foreground absolute right-2 -bottom-px left-2 h-0.5 rounded-full"
                                            />
                                        )}
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="ml-auto flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-foreground size-9"
                        >
                            <Search className="!size-5" />
                            <span className="sr-only">Search</span>
                        </Button>
                        <div className="hidden items-center gap-0.5 lg:flex">
                            {rightNavItems.map((item) => (
                                <Tooltip key={item.title}>
                                    <TooltipTrigger
                                        render={
                                            <a
                                                href={toUrl(item.href)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring inline-flex size-9 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                                            >
                                                <span className="sr-only">{item.title}</span>
                                                {item.icon && <item.icon className="size-5" />}
                                            </a>
                                        }
                                    />
                                    <TooltipContent>
                                        <p>{item.title}</p>
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                        </div>
                        <div className="bg-border mx-1 hidden h-6 w-px lg:block" />
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                render={
                                    <Button
                                        variant="ghost"
                                        className="hover:bg-accent data-[state=open]:bg-accent size-9 rounded-full p-0.5 transition-colors"
                                    >
                                        <Avatar className="ring-border size-8 overflow-hidden rounded-full ring-1">
                                            <AvatarImage
                                                src={auth.user?.avatar ?? undefined}
                                                alt={auth.user?.name}
                                            />
                                            <AvatarFallback className="bg-muted text-foreground rounded-full text-[11px] font-semibold">
                                                {getInitials(auth.user?.name ?? '')}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                }
                            />
                            <DropdownMenuContent className="w-56" align="end">
                                {auth.user && <UserMenuContent user={auth.user} />}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            {breadcrumbs.length > 1 && (
                <div className="border-border/60 bg-background w-full border-b">
                    <div className="mx-auto flex h-11 w-full items-center px-4 md:max-w-7xl md:px-6">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
