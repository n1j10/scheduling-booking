import { api } from '@/lib/axios';
import type {
  CreateBookingInput,
  PublicBooking,
  PublicEventType,
  PublicProfile,
  SlotsResponse,
} from './types';

export async function getPublicProfile(username: string) {
  const response = await api.get<PublicProfile>(`/public/${username}`);
  return response.data;
}

export async function getPublicEventType(username: string, slug: string) {
  const response = await api.get<PublicEventType>(`/public/${username}/${slug}`);
  return response.data;
}

// date = "2026-10-22" in the client's timezone
export async function getSlots(username: string, slug: string, date: string, timezone: string) {
  const response = await api.get<SlotsResponse>(`/public/${username}/${slug}/slots`, {
    params: { date, timezone },
  });
  return response.data;
}

export async function createBooking(input: CreateBookingInput) {
  const response = await api.post<PublicBooking>('/public/bookings', input);
  return response.data;
}

export async function getBooking(id: string) {
  const response = await api.get<PublicBooking>(`/public/bookings/${id}`);
  return response.data;
}

export async function cancelBooking(id: string) {
  const response = await api.post<PublicBooking>(`/public/bookings/${id}/cancel`);
  return response.data;
}
