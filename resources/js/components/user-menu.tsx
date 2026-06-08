import { Link } from '@inertiajs/react';
import { LayoutGridIcon, LogOutIcon, UserCogIcon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useInitials } from '@/hooks/use-initials';
import { useLogout } from '@/hooks/use-logout';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { profile } from '@/routes/ucp';
import type { User } from '@/types';

export function UserMenu({ user }: { user: User }) {
    const getInitials = useInitials();
    const cleanup = useMobileNavigation();
    const logout = useLogout();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={<Button variant="ghost" size="icon-sm" className="rounded-full" aria-label="User menu" />}
            >
                <Avatar className="size-8">
                    <AvatarImage src={user.avatar_url} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-60">
                <div className="px-2 py-2">
                    <UserInfo user={user} showEmail />
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem render={<Link href={profile()} onClick={cleanup} />}>
                        <UserCogIcon />
                        My profile
                    </DropdownMenuItem>
                    {user.can_access_admin ? (
                        <DropdownMenuItem render={<a href="/admin" onClick={cleanup} />}>
                            <LayoutGridIcon />
                            Admin panel
                        </DropdownMenuItem>
                    ) : null}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={logout}>
                    <LogOutIcon />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
