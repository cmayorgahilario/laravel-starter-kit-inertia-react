import { Link, usePage } from '@inertiajs/react';
import {
    BookOpenIcon,
    ChevronDownIcon,
    FolderIcon,
    type LucideIcon,
    MenuIcon,
    SearchIcon,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';
import { Breadcrumbs } from '@/components/breadcrumbs';
import type { NavMainItem } from '@/components/nav-main';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { UserMenuContent } from '@/components/user-menu-content';
import { mainNav } from '@/data/navigation';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useInitials } from '@/hooks/use-initials';
import { cn, toUrl } from '@/lib/utils';
import type { BreadcrumbItem, NavItem } from '@/types';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

const rightNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderIcon,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpenIcon,
    },
];

const activeItemStyles = 'text-foreground';

function HeaderNavItem({ item }: { item: NavMainItem }) {
    const { isCurrentUrl, whenCurrentUrl } = useCurrentUrl();

    if (item.type === 'single') {
        const hasChildren = Boolean(item.items && item.items.length > 0);

        if (!hasChildren) {
            return (
                <NavigationMenuItem className="relative flex h-full items-center">
                    <Link
                        href={item.url}
                        className={cn(
                            navigationMenuTriggerStyle(),
                            'h-9 cursor-pointer gap-2 bg-transparent px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
                            whenCurrentUrl(item.url, activeItemStyles),
                        )}
                    >
                        {item.icon && <item.icon />}
                        {item.title}
                    </Link>
                    {isCurrentUrl(item.url) && (
                        <span
                            aria-hidden
                            className="absolute right-2 -bottom-px left-2 h-0.5 rounded-full bg-foreground"
                        />
                    )}
                </NavigationMenuItem>
            );
        }

        return (
            <NavigationMenuItem className="relative flex h-full items-center">
                <NavigationMenuTrigger className="h-9 gap-2 bg-transparent px-3 text-sm font-medium text-muted-foreground hover:text-foreground">
                    {item.icon && <item.icon />}
                    {item.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                    <ul className="grid w-[220px] gap-0.5 p-1">
                        {item.items!.map((sub) => (
                            <li key={sub.title}>
                                <NavigationMenuLink
                                    render={<Link href={sub.url} />}
                                >
                                    <span>{sub.title}</span>
                                </NavigationMenuLink>
                            </li>
                        ))}
                    </ul>
                </NavigationMenuContent>
            </NavigationMenuItem>
        );
    }

    return (
        <NavigationMenuItem className="relative flex h-full items-center">
            <NavigationMenuTrigger className="h-9 bg-transparent px-3 text-sm font-medium text-muted-foreground hover:text-foreground">
                {item.title}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
                <ul className="grid w-[260px] gap-1 p-1">
                    {item.items.map((child) => {
                        if (child.items && child.items.length > 0) {
                            return (
                                <li key={child.title} className="pt-1">
                                    <div className="flex items-center gap-2 px-2 py-1 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                                        {child.icon && <child.icon />}
                                        <span>{child.title}</span>
                                    </div>
                                    <ul className="grid gap-0.5">
                                        {child.items.map((sub) => (
                                            <li key={sub.title}>
                                                <NavigationMenuLink
                                                    className="pl-7"
                                                    render={
                                                        <Link href={sub.url} />
                                                    }
                                                >
                                                    <span>{sub.title}</span>
                                                </NavigationMenuLink>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            );
                        }
                        return (
                            <li key={child.title}>
                                <NavigationMenuLink
                                    render={<Link href={child.url} />}
                                >
                                    {child.icon && <child.icon />}
                                    <span>{child.title}</span>
                                </NavigationMenuLink>
                            </li>
                        );
                    })}
                </ul>
            </NavigationMenuContent>
        </NavigationMenuItem>
    );
}

function MobileNavLeaf({
    title,
    url,
    icon: Icon,
}: {
    title: string;
    url: string;
    icon?: LucideIcon;
}) {
    return (
        <Link
            href={url}
            className="flex items-center gap-3 rounded-md px-3 py-2 font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
            {Icon && <Icon />}
            <span>{title}</span>
        </Link>
    );
}

function MobileNavItem({ item }: { item: NavMainItem }) {
    if (item.type === 'single') {
        if (!item.items || item.items.length === 0) {
            return (
                <MobileNavLeaf
                    title={item.title}
                    url={item.url}
                    icon={item.icon}
                />
            );
        }
        return (
            <Collapsible className="group/mobile-nav">
                <CollapsibleTrigger className="flex w-full items-center gap-3 rounded-md px-3 py-2 font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                    {item.icon && <item.icon />}
                    <span className="flex-1 text-left">{item.title}</span>
                    <ChevronDownIcon className="size-4 transition-transform group-data-open/mobile-nav:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-3 flex flex-col gap-0.5 border-l border-sidebar-border/60 pl-3">
                    {item.items.map((sub) => (
                        <Link
                            key={sub.title}
                            href={sub.url}
                            className="rounded-md px-3 py-1.5 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        >
                            {sub.title}
                        </Link>
                    ))}
                </CollapsibleContent>
            </Collapsible>
        );
    }

    return (
        <div className="flex flex-col gap-1">
            <p className="px-3 py-2 text-[11px] font-medium tracking-[0.08em] text-sidebar-foreground/60 uppercase">
                {item.title}
            </p>
            {item.items.map((child) => {
                if (child.items && child.items.length > 0) {
                    return (
                        <Collapsible
                            key={child.title}
                            className="group/mobile-nav"
                        >
                            <CollapsibleTrigger className="flex w-full items-center gap-3 rounded-md px-3 py-2 font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                                {child.icon && <child.icon />}
                                <span className="flex-1 text-left">
                                    {child.title}
                                </span>
                                <ChevronDownIcon className="size-4 transition-transform group-data-open/mobile-nav:rotate-180" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="ml-3 flex flex-col gap-0.5 border-l border-sidebar-border/60 pl-3">
                                {child.items.map((sub) => (
                                    <Link
                                        key={sub.title}
                                        href={sub.url}
                                        className="rounded-md px-3 py-1.5 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
                                    >
                                        {sub.title}
                                    </Link>
                                ))}
                            </CollapsibleContent>
                        </Collapsible>
                    );
                }
                return (
                    <MobileNavLeaf
                        key={child.title}
                        title={child.title}
                        url={child.url}
                        icon={child.icon}
                    />
                );
            })}
        </div>
    );
}

export function AppHeader({ breadcrumbs = [] }: Props) {
    const page = usePage();
    const { auth } = page.props;
    const getInitials = useInitials();

    return (
        <>
            <div className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md backdrop-saturate-150">
                <div className="mx-auto flex h-16 items-center gap-3 px-4 md:max-w-7xl md:gap-4 md:px-6">
                    {/* Mobile Menu */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger
                                render={
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="-ml-1 size-9"
                                    >
                                        <MenuIcon className="size-5" />
                                    </Button>
                                }
                            />
                            <SheetContent
                                side="left"
                                className="flex h-full w-72 flex-col items-stretch justify-between gap-0 bg-sidebar p-0"
                            >
                                <SheetTitle className="sr-only">
                                    Navigation menu
                                </SheetTitle>
                                <SheetHeader className="flex h-14 flex-row items-center justify-start border-b border-sidebar-border/60 px-5 text-left">
                                    <AppLogoIcon className="size-6 fill-current text-sidebar-foreground" />
                                </SheetHeader>
                                <div className="flex flex-1 flex-col justify-between overflow-y-auto p-3 text-sm">
                                    <div className="flex flex-col gap-2">
                                        {mainNav.map((item, index) => (
                                            <MobileNavItem
                                                key={`${item.title}-${index}`}
                                                item={item}
                                            />
                                        ))}
                                    </div>

                                    <div className="flex flex-col gap-1 border-t border-sidebar-border/60 pt-3">
                                        {rightNavItems.map((item) => (
                                            <a
                                                key={item.title}
                                                href={toUrl(item.href)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
                                            >
                                                {item.icon && (
                                                    <item.icon className="size-4" />
                                                )}
                                                <span>{item.title}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link href="#" prefetch className="flex items-center gap-2">
                        <AppLogo />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="ml-6 hidden h-full items-center gap-1 lg:flex">
                        <NavigationMenu className="flex h-full items-stretch">
                            <NavigationMenuList className="flex h-full items-stretch gap-1">
                                {mainNav.map((item, index) => (
                                    <HeaderNavItem
                                        key={`${item.title}-${index}`}
                                        item={item}
                                    />
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="ml-auto flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-9 text-muted-foreground hover:text-foreground"
                        >
                            <SearchIcon className="!size-5" />
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
                                                className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                                            >
                                                <span className="sr-only">
                                                    {item.title}
                                                </span>
                                                {item.icon && (
                                                    <item.icon className="size-5" />
                                                )}
                                            </a>
                                        }
                                    />
                                    <TooltipContent>
                                        <p>{item.title}</p>
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                        </div>
                        <div className="mx-1 hidden h-6 w-px bg-border lg:block" />
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                render={
                                    <Button
                                        variant="ghost"
                                        className="size-9 rounded-full p-0.5 transition-colors hover:bg-accent data-[state=open]:bg-accent"
                                    >
                                        <Avatar className="size-8 overflow-hidden rounded-full ring-1 ring-border">
                                            <AvatarImage
                                                src={
                                                    auth.user?.avatar ??
                                                    undefined
                                                }
                                                alt={auth.user?.name}
                                            />
                                            <AvatarFallback className="rounded-full bg-muted text-[11px] font-semibold text-foreground">
                                                {getInitials(
                                                    auth.user?.name ?? '',
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                }
                            />
                            <DropdownMenuContent className="w-56" align="end">
                                {auth.user && (
                                    <UserMenuContent user={auth.user} />
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            {breadcrumbs.length > 1 && (
                <div className="w-full border-b border-border/60 bg-background">
                    <div className="mx-auto flex h-11 w-full items-center px-4 md:max-w-7xl md:px-6">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
