import { create } from 'zustand';
import { getErrorMessage } from '@/lib/axios';
import type { ActionResult } from '@/types';
import * as eventTypesApi from './api';
import type { EventType, EventTypeInput, UpdateEventTypeInput } from './types';

type EventTypesState = {
  eventTypes: EventType[];
  isLoading: boolean;
  error: string | null;

  fetchEventTypes: () => Promise<void>;
  createEventType: (input: EventTypeInput) => Promise<ActionResult>;
  updateEventType: (id: string, input: UpdateEventTypeInput) => Promise<ActionResult>;
  deleteEventType: (id: string) => Promise<ActionResult>;
};

export const useEventTypesStore = create<EventTypesState>((set, get) => ({
  eventTypes: [],
  isLoading: false,
  error: null,

  fetchEventTypes: async () => {
    set({ isLoading: true, error: null });
    try {
      const eventTypes = await eventTypesApi.getEventTypes();
      set({ eventTypes, isLoading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
    }
  },

  createEventType: async (input) => {
    try {
      const created = await eventTypesApi.createEventType(input);
      set({ eventTypes: [...get().eventTypes, created] });
      return { ok: true };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error) };
    }
  },

  updateEventType: async (id, input) => {
    try {
      const updated = await eventTypesApi.updateEventType(id, input);
      set({
        eventTypes: get().eventTypes.map((item) => (item.id === id ? updated : item)),
      });
      return { ok: true };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error) };
    }
  },

  deleteEventType: async (id) => {
    try {
      const result = await eventTypesApi.deleteEventType(id);

      if (result.deleted) {
        // Really deleted -> remove from the list
        set({ eventTypes: get().eventTypes.filter((item) => item.id !== id) });
      } else {
        // Has bookings -> it was only turned off
        set({
          eventTypes: get().eventTypes.map((item) =>
            item.id === id ? { ...item, isActive: false } : item,
          ),
        });
      }
      return { ok: true };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error) };
    }
  },
}));
