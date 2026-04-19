import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground ring-sidebar-primary/10 relative flex aspect-square size-9 items-center justify-center rounded-lg shadow-sm ring-1 ring-inset">
                <AppLogoIcon className="text-sidebar-primary-foreground size-5 fill-current" />
            </div>
            <div className="ml-1 grid flex-1 text-left">
                <span className="truncate text-sm leading-tight font-semibold tracking-tight">
                    Laravel Starter Kit
                </span>
                <span className="text-sidebar-foreground/60 truncate text-[11px] leading-tight">
                    Workspace
                </span>
            </div>
        </>
    );
}
