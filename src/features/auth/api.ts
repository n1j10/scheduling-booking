import { api } from '@/lib/axios';
import type { UpdateProfileInput, UserProfile } from './types';

export async function getMe() {
  const response = await api.get<UserProfile>('/users/me');
  return response.data;
}

export async function updateMe(input: UpdateProfileInput) {
  const response = await api.put<UserProfile>('/users/me', input);
  return response.data;
}
