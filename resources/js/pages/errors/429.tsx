import { ErrorPage } from '@/components/error-page';

export default function TooManyRequests() {
    return (
        <ErrorPage
            status={429}
            title="Too many requests"
            description="You've made too many requests in a short time. Wait a moment before trying again."
        />
    );
}
