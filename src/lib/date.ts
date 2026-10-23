import { formatInTimeZone } from 'date-fns-tz';

export const WEEK_DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export function getBrowserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
}

export function getAllTimezones(): string[] {
  try {
    return Intl.supportedValuesOf('timeZone');
  } catch {
    return ['UTC'];
  }
}

// All the functions below take a UTC date from the API and show it in a timezone

export function formatTime(date: string | Date, timezone: string): string {
  return formatInTimeZone(date, timezone, 'h:mm a'); // 9:30 AM
}

export function formatFullDate(date: string | Date, timezone: string): string {
  return formatInTimeZone(date, timezone, 'EEEE, MMMM d, yyyy'); // Thursday, October 22, 2026
}

export function formatShortDate(date: string | Date, timezone: string): string {
  return formatInTimeZone(date, timezone, 'EEE, MMM d'); // Thu, Oct 22
}

// Today's date ("2026-10-22") in a timezone, used to disable past days
export function todayInTimezone(timezone: string): string {
  return formatInTimeZone(new Date(), timezone, 'yyyy-MM-dd');
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} h ${rest} min` : `${hours} h`;
}
