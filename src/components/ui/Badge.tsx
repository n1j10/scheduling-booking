import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BadgeProps = {
  color?: 'green' | 'gray' | 'red' | 'blue';
  children: ReactNode;
};

const colors = {
  green: 'bg-green-100 text-green-700',
  gray: 'bg-slate-100 text-slate-600',
  red: 'bg-red-100 text-red-700',
  blue: 'bg-blue-100 text-blue-700',
};

export function Badge({ color = 'gray', children }: BadgeProps) {
  return (
    <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-medium', colors[color])}>
      {children}
    </span>
  );
}
