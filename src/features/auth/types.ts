export type UserProfile = {
  id: string;
  email: string;
  name: string | null;
  username: string;
  timezone: string;
  createdAt: string;
};

export type UpdateProfileInput = {
  name?: string | null;
  username?: string;
  timezone?: string;
};
