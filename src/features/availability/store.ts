import { create } from 'zustand';
import { getErrorMessage } from '@/lib/axios';
import { WEEK_DAYS } from '@/lib/date';
import type { ActionResult } from '@/types';
import * as availabilityApi from './api';
import type { AvailabilityRule } from './types';

// To keep the UI simple we edit ONE time range per day.
// (The API supports more, so this is easy to extend later.)

type AvailabilityState = {
  rules: AvailabilityRule[];
  isLoading: boolean;
  error: string | null;

  fetchAvailability: () => Promise<void>;
  toggleDay: (dayOfWeek: number) => void;
  updateTime: (dayOfWeek: number, field: 'startTime' | 'endTime', value: string) => void;
  saveAvailability: () => Promise<ActionResult>;
};

function onlyOneRulePerDay(rules: AvailabilityRule[]): AvailabilityRule[] {
  const result: AvailabilityRule[] = [];
  for (const rule of rules) {
    const alreadyAdded = result.some((r) => r.dayOfWeek === rule.dayOfWeek);
    if (!alreadyAdded) result.push(rule);
  }
  return result;
}

export const useAvailabilityStore = create<AvailabilityState>((set, get) => ({
  rules: [],
  isLoading: false,
  error: null,

  fetchAvailability: async () => {
    set({ isLoading: true, error: null });
    try {
      const rules = await availabilityApi.getAvailability();
      set({ rules: onlyOneRulePerDay(rules), isLoading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
    }
  },

  // Turn a day on (with default 9-5) or off
  toggleDay: (dayOfWeek) => {
    const rules = get().rules;
    const isOn = rules.some((rule) => rule.dayOfWeek === dayOfWeek);

    if (isOn) {
      set({ rules: rules.filter((rule) => rule.dayOfWeek !== dayOfWeek) });
    } else {
      const newRule = { dayOfWeek, startTime: '09:00', endTime: '17:00' };
      set({ rules: [...rules, newRule].sort((a, b) => a.dayOfWeek - b.dayOfWeek) });
    }
  },

  updateTime: (dayOfWeek, field, value) => {
    set({
      rules: get().rules.map((rule) =>
        rule.dayOfWeek === dayOfWeek ? { ...rule, [field]: value } : rule,
      ),
    });
  },

  saveAvailability: async () => {
    const rules = get().rules;

    // Simple check before calling the API ("09:00" < "17:00" works as text)
    const invalidRule = rules.find((rule) => rule.startTime >= rule.endTime);
    if (invalidRule) {
      return {
        ok: false,
        error: `${WEEK_DAYS[invalidRule.dayOfWeek]}: end time must be after start time`,
      };
    }

    try {
      const saved = await availabilityApi.updateAvailability(rules);
      set({ rules: onlyOneRulePerDay(saved) });
      return { ok: true };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error) };
    }
  },
}));
