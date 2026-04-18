import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/settings/appearance';
import { edit as editNotifications } from '@/routes/settings/notifications';
import { edit as editSecurity } from '@/routes/settings/password';
import { edit } from '@/routes/settings/profile';
import { index as sessionsIndex } from '@/routes/settings/sessions';
import type { NavItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: edit(),
        icon: null,
    },
    {
        title: 'Security',
        href: editSecurity(),
        icon: null,
    },
    {
        title: 'Notifications',
        href: editNotifications(),
        icon: null,
    },
    {
        title: 'Sessions',
        href: sessionsIndex(),
        icon: null,
    },
    {
        title: 'Appearance',
        href: editAppearance(),
        icon: null,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6 md:py-10">
            <Heading
                title="Settings"
                description="Manage your profile and account settings"
            />

            <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
                <aside className="w-full lg:w-56 lg:shrink-0">
                    <nav
                        className="flex flex-col gap-0.5"
                        aria-label="Settings"
                    >
                        {sidebarNavItems.map((item, index) => {
                            const active = isCurrentOrParentUrl(item.href);
                            return (
                                <Link
                                    key={`${toUrl(item.href)}-${index}`}
                                    href={item.href}
                                    className={cn(
                                        'relative flex h-9 items-center rounded-md px-3 text-sm font-medium transition-colors duration-150',
                                        active
                                            ? 'bg-accent text-accent-foreground'
                                            : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                                    )}
                                >
                                    {active && (
                                        <span
                                            aria-hidden
                                            className="absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 rounded-full bg-foreground"
                                        />
                                    )}
                                    {item.icon && (
                                        <item.icon className="mr-2 size-4" />
                                    )}
                                    {item.title}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                <Separator className="lg:hidden" />

                <div className="flex-1 lg:max-w-2xl">
                    <section className="space-y-10">{children}</section>
                </div>
            </div>
        </div>
    );
}
