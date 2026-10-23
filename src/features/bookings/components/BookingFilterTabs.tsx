import { cn } from '@/lib/utils';
import { useBookingsStore } from '../store';
import type { BookingFilter } from '../types';

const tabs: { value: BookingFilter; label: string }[] = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past' },
  { value: 'cancelled', label: 'Cancelled' },
];

export function BookingFilterTabs() {
  const { filter, setFilter } = useBookingsStore();

  return (
    <div className="mb-4 inline-flex rounded-md border border-slate-200 bg-white p-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => setFilter(tab.value)}
          className={cn(
            'rounded px-4 py-1.5 text-sm font-medium',
            filter === tab.value ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
