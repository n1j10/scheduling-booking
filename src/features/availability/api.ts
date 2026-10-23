import { api } from '@/lib/axios';
import type { AvailabilityRule } from './types';

export async function getAvailability() {
  const response = await api.get<AvailabilityRule[]>('/users/availability');
  return response.data;
}

export async function updateAvailability(rules: AvailabilityRule[]) {
  const response = await api.put<AvailabilityRule[]>('/users/availability', {
    availabilities: rules,
  });
  return response.data;
}
