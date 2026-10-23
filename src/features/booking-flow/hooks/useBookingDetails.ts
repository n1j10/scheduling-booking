import { useEffect, useState } from 'react';
import { getErrorMessage } from '@/lib/axios';
import type { ActionResult } from '@/types';
import { cancelBooking, getBooking } from '../api';
import type { PublicBooking } from '../types';

export function useBookingDetails(bookingId: string | undefined) {
  const [booking, setBooking] = useState<PublicBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) return;

    let ignore = false;
    setIsLoading(true);

    getBooking(bookingId)
      .then((data) => {
        if (!ignore) setBooking(data);
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
  }, [bookingId]);

  async function cancel(): Promise<ActionResult> {
    if (!bookingId) return { ok: false, error: 'Missing booking id' };
    try {
      const updated = await cancelBooking(bookingId);
      setBooking(updated);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: getErrorMessage(err) };
    }
  }

  return { booking, isLoading, error, cancel };
}
