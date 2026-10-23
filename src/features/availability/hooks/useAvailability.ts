import { useEffect } from 'react';
import { useAvailabilityStore } from '../store';

export function useAvailability() {
  const store = useAvailabilityStore();
  const fetchAvailability = useAvailabilityStore((state) => state.fetchAvailability);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  return store;
}
