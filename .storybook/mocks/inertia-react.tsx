import type {
    AnchorHTMLAttributes,
    FormHTMLAttributes,
    ReactNode,
    Ref,
} from 'react';
import { Fragment, forwardRef, useMemo } from 'react';

type WayfinderHref = { url?: string; method?: string } | string | null | undefined;

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    href?: WayfinderHref;
    prefetch?: boolean | 'hover' | 'click' | 'mount';
    preserveScroll?: boolean;
    preserveState?: boolean;
    replace?: boolean;
    only?: string[];
    method?: string;
    ref?: Ref<HTMLAnchorElement>;
};

function resolveHref(href: WayfinderHref): string {
    if (!href) return '#';
    if (typeof href === 'string') return href;
    if (typeof href === 'object' && typeof href.url === 'string') return href.url;
    return '#';
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
    {
        href,
        children,
        prefetch: _prefetch,
        preserveScroll: _preserveScroll,
        preserveState: _preserveState,
        replace: _replace,
        only: _only,
        method: _method,
        onClick,
        ...rest
    },
    ref,
) {
    const resolved = resolveHref(href);
    return (
        <a
            {...rest}
            ref={ref}
            href={resolved}
            onClick={(event) => {
                event.preventDefault();
                onClick?.(event);
            }}
        >
            {children}
        </a>
    );
});

type FormRenderState = {
    processing: boolean;
    errors: Record<string, string>;
    wasSuccessful: boolean;
    recentlySuccessful: boolean;
    resetAndClearErrors: () => void;
    reset: () => void;
    clearErrors: () => void;
    setError: (key: string, value: string) => void;
};

type FormChildren =
    | ReactNode
    | ((state: FormRenderState) => ReactNode);

type FormProps = Omit<FormHTMLAttributes<HTMLFormElement>, 'action' | 'children'> & {
    action?: WayfinderHref;
    url?: string;
    method?: string;
    options?: Record<string, unknown>;
    resetOnSuccess?: boolean | string[];
    resetOnError?: boolean | string[];
    onSuccess?: () => void;
    onError?: (errors: Record<string, string>) => void;
    children?: FormChildren;
};

const defaultFormState: FormRenderState = {
    processing: false,
    errors: {},
    wasSuccessful: false,
    recentlySuccessful: false,
    resetAndClearErrors: () => {},
    reset: () => {},
    clearErrors: () => {},
    setError: () => {},
};

export function Form({
    action,
    url: _url,
    method,
    options: _options,
    resetOnSuccess: _resetOnSuccess,
    resetOnError: _resetOnError,
    onSuccess: _onSuccess,
    onError: _onError,
    children,
    ...rest
}: FormProps) {
    const resolvedAction = resolveHref(action);
    const content =
        typeof children === 'function' ? children(defaultFormState) : children;

    return (
        <form
            {...rest}
            action={resolvedAction}
            method={method ?? 'post'}
            onSubmit={(event) => event.preventDefault()}
        >
            {content}
        </form>
    );
}

type PageProps = Record<string, unknown> & {
    auth?: { user?: unknown };
    sidebarOpen?: boolean;
};

type PageShape = {
    url: string;
    component: string;
    props: PageProps;
    version: string | null;
};

const defaultUser = {
    id: 1,
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    avatar: null,
    email_verified_at: new Date().toISOString(),
};

const defaultPage: PageShape = {
    url: '/',
    component: 'Storybook',
    props: {
        auth: { user: defaultUser },
        sidebarOpen: true,
        breadcrumbs: [],
        flash: {},
        app: { name: 'Storybook' },
    },
    version: null,
};

declare global {
    interface Window {
        __STORYBOOK_INERTIA_PAGE__?: Partial<PageShape>;
    }
}

export function usePage<T extends PageProps = PageProps>(): PageShape & { props: T } {
    const override =
        typeof window !== 'undefined' ? window.__STORYBOOK_INERTIA_PAGE__ : undefined;
    return useMemo(() => {
        const merged: PageShape = {
            ...defaultPage,
            ...override,
            props: {
                ...defaultPage.props,
                ...(override?.props as PageProps | undefined),
            },
        };
        return merged as PageShape & { props: T };
    }, [override]);
}

type RouterNoop = (...args: unknown[]) => void;

const noop: RouterNoop = () => {};

export const router = {
    visit: noop,
    get: noop,
    post: noop,
    put: noop,
    patch: noop,
    delete: noop,
    reload: noop,
    replace: noop,
    remember: noop,
    restore: noop,
    cancel: noop,
    flushAll: noop,
    on: () => () => {},
};

export function Head({ children }: { children?: ReactNode }) {
    return <Fragment>{children}</Fragment>;
}

export function WhenVisible({ children }: { children?: ReactNode }) {
    return <Fragment>{children}</Fragment>;
}

export type InertiaLinkProps = LinkProps;
