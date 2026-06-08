import { Link, usePage } from '@inertiajs/react';
import { LayoutGridIcon, LogOutIcon, MenuIcon, UserCogIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { AppLogo } from '@/components/app-logo';
import { AppearanceTabs } from '@/components/appearance-tabs';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { UserInfo } from '@/components/user-info';
import { useLogout } from '@/hooks/use-logout';
import { MOBILE_BREAKPOINT } from '@/hooks/use-mobile';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { cn, toUrl } from '@/lib/utils';
import { dashboard } from '@/routes';
import { profile } from '@/routes/ucp';
import type { NavItem, SharedData } from '@/types';

const mainNav: NavItem[] = [{ title: 'Dashboard', href: dashboard(), icon: LayoutGridIcon }];

const actionClass =
    'flex items-center gap-3 px-4 py-2.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase transition-colors hover:bg-muted/50 hover:text-foreground';

const logoutClass =
    'flex w-full items-center gap-3 px-4 py-2.5 text-xs font-semibold tracking-wider text-destructive uppercase transition-colors hover:bg-destructive/10';

export function AppMobileNav() {
    const [open, setOpen] = useState(false);
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const cleanup = useMobileNavigation();
    const logout = useLogout();

    // Close the panel when switching to desktop: the state lives in React and the
    // trigger is hidden with `md:hidden`, so without this it would stay open
    // after crossing the breakpoint.
    useEffect(() => {
        const desktop = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px)`);

        const closeOnDesktop = (event: MediaQueryListEvent) => {
            if (event.matches) {
                setOpen(false);
            }
        };

        desktop.addEventListener('change', closeOnDesktop);

        return () => desktop.removeEventListener('change', closeOnDesktop);
    }, []);

    const close = () => {
        setOpen(false);
        cleanup();
    };

    const handleLogout = () => {
        setOpen(false);
        logout();
    };

    const itemClass = (href: NavItem['href']) =>
        cn(
            'flex items-center gap-3 border-l-2 px-4 py-2.5 text-xs font-semibold tracking-wider uppercase transition-colors',
            page.url.startsWith(toUrl(href))
                ? 'border-primary bg-muted text-foreground'
                : 'border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground',
        );

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
                render={
                    <Button variant="ghost" size="icon-sm" className="md:hidden" aria-label="Open navigation menu" />
                }
            >
                <MenuIcon />
            </SheetTrigger>

            <SheetContent side="left" className="gap-0">
                <SheetHeader className="border-b border-border p-5">
                    <SheetTitle className="sr-only">Navigation</SheetTitle>
                    <AppLogo />
                </SheetHeader>

                <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
                    {mainNav.map((item) => (
                        <Link key={item.title} href={item.href} onClick={close} className={itemClass(item.href)}>
                            {item.icon ? <item.icon className="size-4" /> : null}
                            {item.title}
                        </Link>
                    ))}
                </nav>

                <SheetFooter className="mt-auto gap-0 p-0">
                    <div className="border-t border-border p-4">
                        <AppearanceTabs />
                    </div>
                    {auth.user ? (
                        <>
                            <div className="border-t border-border px-5 py-4">
                                <UserInfo user={auth.user} showEmail />
                            </div>
                            <div className="flex flex-col gap-0.5 px-3 pb-3">
                                <Link href={profile()} onClick={close} className={actionClass}>
                                    <UserCogIcon className="size-4" />
                                    My profile
                                </Link>
                                {auth.user.can_access_admin ? (
                                    <a href="/admin" onClick={close} className={actionClass}>
                                        <LayoutGridIcon className="size-4" />
                                        Admin panel
                                    </a>
                                ) : null}
                                <button type="button" onClick={handleLogout} className={logoutClass}>
                                    <LogOutIcon className="size-4" />
                                    Sign out
                                </button>
                            </div>
                        </>
                    ) : null}
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
