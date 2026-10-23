import { useEffect } from 'react';
import { useProfileStore } from '../store';

// Returns the logged-in provider's profile from our API (username, timezone...)
// and loads it the first time it's needed.
export function useCurrentUser() {
  const { profile, isLoading, error, fetchProfile } = useProfileStore();

  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
  }, [profile, fetchProfile]);

  return { profile, isLoading: isLoading || (!profile && !error), error };
}
