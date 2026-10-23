import { api } from '@/lib/axios';
import type { Booking, BookingFilter } from './types';

export async function getMyBookings(status: BookingFilter) {
  const response = await api.get<Booking[]>('/bookings', { params: { status } });
  return response.data;
}

export async function cancelBooking(id: string) {
  const response = await api.patch(`/bookings/${id}/cancel`);
  return response.data;
}
