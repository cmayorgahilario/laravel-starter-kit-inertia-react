import { ErrorPage } from '@/components/error-page';

export default function ServiceUnavailable() {
    return (
        <ErrorPage
            status={503}
            title="Under maintenance"
            description="We're making some adjustments to improve your experience. We'll be back shortly."
        />
    );
}
