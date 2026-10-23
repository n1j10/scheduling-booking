import { ClerkProvider } from '@clerk/clerk-react';
import { Outlet, useNavigate } from 'react-router';
import { AuthTokenSync } from '@/features/auth';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in frontend/.env');
}

// Rendered as the root route, so Clerk can use react-router for navigation
export function Providers() {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      afterSignOutUrl="/"
    >
      <AuthTokenSync />
      <Outlet />
    </ClerkProvider>
  );
}
