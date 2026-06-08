import { ErrorPage } from '@/components/error-page';

export default function ServerError() {
    return (
        <ErrorPage
            status={500}
            title="Server error"
            description="Something went wrong on our end. We're on it; try again in a few minutes."
        />
    );
}
