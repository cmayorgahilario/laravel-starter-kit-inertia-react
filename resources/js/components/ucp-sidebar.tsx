import { Link, usePage } from '@inertiajs/react';
import { KeyRoundIcon, MonitorSmartphoneIcon, ShieldCheckIcon, UserRoundIcon } from 'lucide-react';

import { cn, toUrl } from '@/lib/utils';
import { password, profile, security, sessions } from '@/routes/ucp';
import type { NavItem, SharedData } from '@/types';

export function UcpSidebar() {
    const page = usePage<SharedData>();

    const items: NavItem[] = [
        { title: 'Profile', href: profile(), icon: UserRoundIcon },
        { title: 'Password', href: password(), icon: KeyRoundIcon },
        { title: 'Security', href: security(), icon: ShieldCheckIcon },
        // Browser session management only works with the database session driver.
        ...(page.props.features.browserSessions
            ? [{ title: 'Sessions', href: sessions(), icon: MonitorSmartphoneIcon }]
            : []),
    ];

    return (
        <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:gap-0.5">
            {items.map((item) => {
                const active = page.url.startsWith(toUrl(item.href));
                const Icon = item.icon;

                return (
                    <Link
                        key={item.title}
                        href={item.href}
                        className={cn(
                            'flex shrink-0 items-center gap-3 border-b-2 px-4 py-2.5 text-xs font-semibold tracking-wider whitespace-nowrap uppercase transition-colors lg:border-b-0 lg:border-l-2',
                            active
                                ? 'border-primary text-foreground lg:bg-muted'
                                : 'border-transparent text-muted-foreground hover:text-foreground lg:hover:bg-muted/50',
                        )}
                    >
                        {Icon ? <Icon className="size-4" /> : null}
                        {item.title}
                    </Link>
                );
            })}
        </nav>
    );
}
