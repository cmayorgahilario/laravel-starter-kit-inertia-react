import { ErrorPage } from '@/components/error-page';

export default function Forbidden() {
    return (
        <ErrorPage
            status={403}
            title="Access denied"
            description="You don't have permission to access this page. If you think this is a mistake, contact support."
        />
    );
}
