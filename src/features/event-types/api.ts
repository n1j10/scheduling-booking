import { api } from '@/lib/axios';
import type { EventType, EventTypeInput, UpdateEventTypeInput } from './types';

export async function getEventTypes() {
  const response = await api.get<EventType[]>('/event-types');
  return response.data;
}

export async function createEventType(input: EventTypeInput) {
  const response = await api.post<EventType>('/event-types', input);
  return response.data;
}

export async function updateEventType(id: string, input: UpdateEventTypeInput) {
  const response = await api.put<EventType>(`/event-types/${id}`, input);
  return response.data;
}

// If the event type has bookings, the API hides it instead of deleting it
export async function deleteEventType(id: string) {
  const response = await api.delete<{ deleted: boolean; deactivated: boolean }>(
    `/event-types/${id}`,
  );
  return response.data;
}
