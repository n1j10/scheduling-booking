import { create } from 'zustand';
import { getErrorMessage } from '@/lib/axios';
import { getBrowserTimezone } from '@/lib/date';
import * as bookingApi from './api';
import type { BookingFormData, PublicEventType, Slot } from './types';

// Steps of the public booking page:
// 1. load the event type   2. pick a date -> load slots
// 3. pick a slot           4. fill the form -> create the booking

type BookingFlowState = {
  eventType: PublicEventType | null;
  isLoadingEvent: boolean;
  eventError: string | null;

  timezone: string; // the visitor's timezone
  selectedDate: string | null; // "2026-10-22"
  slots: Slot[];
  isLoadingSlots: boolean;
  slotsError: string | null;

  selectedSlot: Slot | null;
  isSubmitting: boolean;
  submitError: string | null;

  loadEventType: (username: string, slug: string) => Promise<void>;
  setTimezone: (timezone: string) => void;
  selectDate: (date: string) => void;
  fetchSlots: () => Promise<void>;
  selectSlot: (slot: Slot | null) => void;
  submitBooking: (form: BookingFormData) => Promise<string | null>; // returns the booking id
  reset: () => void;
};

const initialState = {
  eventType: null,
  isLoadingEvent: false,
  eventError: null,
  timezone: getBrowserTimezone(),
  selectedDate: null,
  slots: [],
  isLoadingSlots: false,
  slotsError: null,
  selectedSlot: null,
  isSubmitting: false,
  submitError: null,
};

export const useBookingFlowStore = create<BookingFlowState>((set, get) => ({
  ...initialState,

  loadEventType: async (username, slug) => {
    set({ isLoadingEvent: true, eventError: null });
    try {
      const eventType = await bookingApi.getPublicEventType(username, slug);
      set({ eventType, isLoadingEvent: false });
    } catch (error) {
      set({ eventError: getErrorMessage(error), isLoadingEvent: false });
    }
  },

  setTimezone: (timezone) => {
    set({ timezone, selectedSlot: null });
    // The same date has different slots in another timezone
    if (get().selectedDate) get().fetchSlots();
  },

  selectDate: (date) => {
    set({ selectedDate: date, selectedSlot: null, submitError: null });
    get().fetchSlots();
  },

  fetchSlots: async () => {
    const { eventType, selectedDate, timezone } = get();
    if (!eventType || !selectedDate) return;

    set({ isLoadingSlots: true, slotsError: null, slots: [] });
    try {
      const data = await bookingApi.getSlots(
        eventType.user.username,
        eventType.slug,
        selectedDate,
        timezone,
      );

      // Ignore old answers if the user already clicked another date / timezone
      const current = get();
      if (current.selectedDate === selectedDate && current.timezone === timezone) {
        set({ slots: data.slots, isLoadingSlots: false });
      }
    } catch (error) {
      set({ slotsError: getErrorMessage(error), isLoadingSlots: false });
    }
  },

  selectSlot: (slot) => set({ selectedSlot: slot, submitError: null }),

  submitBooking: async (form) => {
    const { eventType, selectedSlot, timezone } = get();
    if (!eventType || !selectedSlot) return null;

    set({ isSubmitting: true, submitError: null });
    try {
      const booking = await bookingApi.createBooking({
        ...form,
        eventTypeId: eventType.id,
        startTime: selectedSlot.start,
        clientTimezone: timezone,
      });
      set({ isSubmitting: false });
      return booking.id;
    } catch (error) {
      // Most likely someone else just took this slot -> refresh the list
      set({ submitError: getErrorMessage(error), isSubmitting: false, selectedSlot: null });
      get().fetchSlots();
      return null;
    }
  },

  reset: () => set({ ...initialState, timezone: get().timezone }),
}));
