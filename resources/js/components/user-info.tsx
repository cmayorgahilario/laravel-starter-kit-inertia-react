import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import type { User } from '@/types';

interface UserInfoProps {
    user: User;
    showEmail?: boolean;
}

export function UserInfo({ user, showEmail = false }: UserInfoProps) {
    const getInitials = useInitials();

    return (
        <div className="flex min-w-0 items-center gap-2.5 text-left">
            <Avatar className="size-8">
                <AvatarImage src={user.avatar_url} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="grid min-w-0 flex-1 leading-tight">
                <span className="truncate text-sm font-medium text-foreground">{user.name}</span>
                {showEmail ? <span className="truncate text-xs text-muted-foreground">{user.email}</span> : null}
            </div>
        </div>
    );
}
