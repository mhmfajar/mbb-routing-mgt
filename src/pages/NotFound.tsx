import { Link } from 'react-router';

export default function NotFound() {
  return (
    <div className="space-y-4 text-center py-16">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-semibold">Page Not Found</h2>
      <p className="text-text-muted">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="btn-primary btn-md inline-block mt-4"
      >
        Go back to Home
      </Link>
    </div>
  );
}
