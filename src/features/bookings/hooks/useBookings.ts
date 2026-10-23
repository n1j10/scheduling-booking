import { useEffect } from 'react';
import { useBookingsStore } from '../store';

export function useBookings() {
  const store = useBookingsStore();
  const fetchBookings = useBookingsStore((state) => state.fetchBookings);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return store;
}
