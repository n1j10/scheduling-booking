import type { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '@clerk/clerk-react';
import { PageSpinner } from '@/components/ui';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <PageSpinner />;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
}
