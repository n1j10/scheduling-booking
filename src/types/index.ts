// Result returned by store actions that the UI needs to react to (forms, buttons)
export type ActionResult = { ok: true } | { ok: false; error: string };

export type BookingStatus = 'CONFIRMED' | 'CANCELLED';

// Shape of error responses from our Express API
export type ApiErrorResponse = {
  message: string;
  details?: Record<string, string[]>;
};
