import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import type { User } from '@/types';

export function UserInfo({ user, showEmail = false }: { user: User; showEmail?: boolean }) {
    const getInitials = useInitials();

    return (
        <>
            <Avatar className="ring-sidebar-border size-8 overflow-hidden rounded-full ring-1">
                <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
                <AvatarFallback className="bg-muted text-foreground rounded-full text-[11px] font-semibold">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                {showEmail && (
                    <span className="text-muted-foreground truncate text-xs">{user.email}</span>
                )}
            </div>
        </>
    );
}
