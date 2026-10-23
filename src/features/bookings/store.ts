import { create } from 'zustand';
import { getErrorMessage } from '@/lib/axios';
import type { ActionResult } from '@/types';
import * as bookingsApi from './api';
import type { Booking, BookingFilter } from './types';

type BookingsState = {
  bookings: Booking[];
  filter: BookingFilter;
  isLoading: boolean;
  error: string | null;

  setFilter: (filter: BookingFilter) => void;
  fetchBookings: () => Promise<void>;
  cancelBooking: (id: string) => Promise<ActionResult>;
};

export const useBookingsStore = create<BookingsState>((set, get) => ({
  bookings: [],
  filter: 'upcoming',
  isLoading: false,
  error: null,

  setFilter: (filter) => {
    set({ filter, bookings: [] });
    get().fetchBookings();
  },

  fetchBookings: async () => {
    const filter = get().filter;
    set({ isLoading: true, error: null });

    try {
      const bookings = await bookingsApi.getMyBookings(filter);
      // The user may have switched tabs while we were waiting
      if (get().filter === filter) {
        set({ bookings, isLoading: false });
      }
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
    }
  },

  cancelBooking: async (id) => {
    try {
      await bookingsApi.cancelBooking(id);
      // A cancelled booking no longer belongs in "upcoming"
      set({ bookings: get().bookings.filter((booking) => booking.id !== id) });
      return { ok: true };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error) };
    }
  },
}));
