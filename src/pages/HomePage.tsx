import { Link } from 'react-router';
import { SignedIn, SignedOut } from '@clerk/clerk-react';

export function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold sm:text-5xl">
        Easy scheduling <span className="text-blue-600">ahead</span>
      </h1>
      <p className="mt-4 max-w-md text-slate-600">
        Share your link, let people pick a time that works, and never deal with double bookings or
        timezone math again.
      </p>

      <div className="mt-8 flex gap-3">
        <SignedOut>
          <Link
            to="/sign-up"
            className="rounded-md bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            Get started
          </Link>
          <Link
            to="/sign-in"
            className="rounded-md border border-slate-300 bg-white px-5 py-2.5 font-medium hover:bg-slate-50"
          >
            Sign in
          </Link>
        </SignedOut>
        <SignedIn>
          <Link
            to="/dashboard"
            className="rounded-md bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            Go to dashboard
          </Link>
        </SignedIn>
      </div>
    </div>
  );
}
