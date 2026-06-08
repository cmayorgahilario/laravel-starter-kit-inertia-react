import { ErrorPage } from '@/components/error-page';

export default function NotFound() {
    return (
        <ErrorPage
            status={404}
            title="Page not found"
            description="The page you're looking for doesn't exist, moved, or was never here."
        />
    );
}
