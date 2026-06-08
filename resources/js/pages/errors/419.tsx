import { ErrorPage } from '@/components/error-page';

export default function PageExpired() {
    return (
        <ErrorPage
            status={419}
            title="Page expired"
            description="Your session expired for security reasons. Reload the page and try again."
        />
    );
}
