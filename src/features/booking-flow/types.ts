import type { BookingStatus } from '@/types';

export type Host = {
  name: string | null;
  username: string;
  timezone: string;
};

export type PublicEventTypeSummary = {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  slug: string;
};

export type PublicProfile = Host & {
  eventTypes: PublicEventTypeSummary[];
};

export type PublicEventType = PublicEventTypeSummary & {
  user: Host;
};

export type Slot = {
  start: string; // UTC ISO string
  end: string;
};

export type SlotsResponse = {
  date: string;
  timezone: string;
  slots: Slot[];
};

export type BookingFormData = {
  clientName: string;
  clientEmail: string;
  clientNotes: string;
};

export type CreateBookingInput = BookingFormData & {
  eventTypeId: string;
  startTime: string;
  clientTimezone: string;
};

export type PublicBooking = {
  id: string;
  status: BookingStatus;
  startTime: string;
  endTime: string;
  clientName: string;
  clientTimezone: string;
  eventType: { title: string; duration: number; slug: string };
  host: Host;
};
