<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Trusted Proxies
    |--------------------------------------------------------------------------
    |
    | Proxies whose X-Forwarded-* headers Laravel's TrustProxies middleware
    | should honor, so the request scheme/host are the real ones behind a
    | proxy/tunnel (cloudflared, load balancer). Use `*` locally, an IP range
    | in production; null trusts none.
    |
    */

    'proxies' => array_filter(explode(',', (string) env('TRUSTED_PROXIES'))) ?: null,

];
