import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type AlertProps = {
  variant?: 'error' | 'success' | 'info';
  children: ReactNode;
  className?: string;
};

const variants = {
  error: 'border-red-200 bg-red-50 text-red-700',
  success: 'border-green-200 bg-green-50 text-green-700',
  info: 'border-blue-200 bg-blue-50 text-blue-700',
};

export function Alert({ variant = 'error', children, className }: AlertProps) {
  return (
    <div role="alert" className={cn('rounded-md border px-4 py-3 text-sm', variants[variant], className)}>
      {children}
    </div>
  );
}
