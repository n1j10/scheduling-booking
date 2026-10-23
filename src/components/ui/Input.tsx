import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const fieldClasses =
  'w-full rounded-md border border-slate-300 bg-white px-3 text-sm shadow-sm ' +
  'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ' +
  'disabled:cursor-not-allowed disabled:bg-slate-100';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldClasses, 'h-10', className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldClasses, 'min-h-24 py-2', className)} {...props} />;
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(fieldClasses, 'h-10', className)} {...props} />;
}
