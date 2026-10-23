import type { BookingStatus } from '@/types';

export type BookingFilter = 'upcoming' | 'past' | 'cancelled';

export type Booking = {
  id: string;
  clientName: string;
  clientEmail: string;
  clientNotes: string | null;
  clientTimezone: string;
  startTime: string; // UTC ISO string
  endTime: string; // UTC ISO string
  status: BookingStatus;
  eventType: {
    title: string;
    duration: number;
  };
};
