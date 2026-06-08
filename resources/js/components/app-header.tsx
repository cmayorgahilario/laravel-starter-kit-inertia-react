import { Link, usePage } from '@inertiajs/react';

import { AppLogo } from '@/components/app-logo';
import { AppMobileNav } from '@/components/app-mobile-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserMenu } from '@/components/user-menu';
import { cn, toUrl } from '@/lib/utils';
import { dashboard } from '@/routes';
import type { NavItem, SharedData } from '@/types';

const mainNav: NavItem[] = [{ title: 'Dashboard', href: dashboard() }];

export function AppHeader() {
    const page = usePage<SharedData>();
    const { auth } = page.props;

    return (
        <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md">
            <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-2 px-4 sm:px-6 lg:px-8">
                <AppLogo />

                <nav className="hidden h-full items-stretch gap-7 md:ml-6 md:flex">
                    {mainNav.map((item) => {
                        const active = page.url.startsWith(toUrl(item.href));

                        return (
                            <Link
                                key={item.title}
                                href={item.href}
                                className={cn(
                                    'inline-flex h-full items-center border-b-2 text-xs font-semibold tracking-[0.15em] uppercase transition-colors',
                                    active
                                        ? 'border-primary text-foreground'
                                        : 'border-transparent text-muted-foreground hover:text-foreground',
                                )}
                            >
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>

                <div className="ml-auto flex items-center gap-1">
                    <div className="hidden items-center gap-1 md:flex">
                        <ThemeToggle />
                        {auth.user ? <UserMenu user={auth.user} /> : null}
                    </div>
                    <AppMobileNav />
                </div>
            </div>
        </header>
    );
}
