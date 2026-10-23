import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-5xl font-bold text-slate-300">404</h1>
      <p className="mt-2 text-slate-600">This page doesn&apos;t exist.</p>
      <Link to="/" className="mt-6 text-blue-600 hover:underline">
        Go home
      </Link>
    </div>
  );
}
