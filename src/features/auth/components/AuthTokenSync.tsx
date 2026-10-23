import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setTokenGetter } from '@/lib/axios';
import { useProfileStore } from '../store';

// Connects Clerk to our axios instance. Renders nothing.
export function AuthTokenSync() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  // Set during render (not in useEffect) so the token is ready
  // before child pages run their own effects and send requests.
  setTokenGetter(isSignedIn ? () => getToken() : null);

  // Forget the old profile after sign out
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      useProfileStore.getState().clearProfile();
    }
  }, [isLoaded, isSignedIn]);

  return null;
}
