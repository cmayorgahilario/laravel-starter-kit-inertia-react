import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="relative flex aspect-square size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm ring-1 ring-sidebar-primary/10 ring-inset">
                <AppLogoIcon className="size-5 fill-current text-sidebar-primary-foreground" />
            </div>
            <div className="ml-1 grid flex-1 text-left">
                <span className="truncate text-sm leading-tight font-semibold tracking-tight">
                    Laravel Starter Kit
                </span>
                <span className="truncate text-[11px] leading-tight text-sidebar-foreground/60">
                    Workspace
                </span>
            </div>
        </>
    );
}
