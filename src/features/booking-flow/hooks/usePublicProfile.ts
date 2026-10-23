import { useEffect, useState } from 'react';
import { getErrorMessage } from '@/lib/axios';
import { getPublicProfile } from '../api';
import type { PublicProfile } from '../types';

// Data used by one page only -> simple local state is enough (no store needed)
export function usePublicProfile(username: string | undefined) {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;

    let ignore = false; // avoid setting state after the username changed
    setIsLoading(true);
    setError(null);

    getPublicProfile(username)
      .then((data) => {
        if (!ignore) setProfile(data);
      })
      .catch((err) => {
        if (!ignore) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [username]);

  return { profile, isLoading, error };
}
