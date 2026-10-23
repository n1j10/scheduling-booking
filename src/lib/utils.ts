import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge Tailwind classes safely: cn('px-2', isActive && 'bg-blue-500')
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// "30 Min Meeting!" -> "30-min-meeting"
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getPublicLink(username: string, slug?: string): string {
  const base = `${window.location.origin}/${username}`;
  return slug ? `${base}/${slug}` : base;
}
