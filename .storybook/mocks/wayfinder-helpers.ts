export type RouteBinding = {
    url: string;
    method: string;
    action?: string;
};

export type RouteFn = {
    (...args: unknown[]): RouteBinding;
    url: (...args: unknown[]) => string;
    form: (...args: unknown[]) => RouteBinding;
    get: (...args: unknown[]) => RouteBinding;
    post: (...args: unknown[]) => RouteBinding;
    put: (...args: unknown[]) => RouteBinding;
    patch: (...args: unknown[]) => RouteBinding;
    delete: (...args: unknown[]) => RouteBinding;
};

export function makeRoute(method: string = 'get', url: string = '#'): RouteFn {
    const binding: RouteBinding = { url, method, action: url };
    const fn = ((..._args: unknown[]) => ({ ...binding })) as RouteFn;
    fn.url = () => url;
    fn.form = () => ({ ...binding });
    fn.get = () => ({ ...binding, method: 'get' });
    fn.post = () => ({ ...binding, method: 'post' });
    fn.put = () => ({ ...binding, method: 'put' });
    fn.patch = () => ({ ...binding, method: 'patch' });
    fn.delete = () => ({ ...binding, method: 'delete' });
    return fn;
}

export function makeAction(method: string = 'post'): RouteFn {
    return makeRoute(method);
}
