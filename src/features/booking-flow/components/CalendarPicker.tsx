import { useState } from 'react';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { cn } from '@/lib/utils';
import { todayInTimezone } from '@/lib/date';

type CalendarPickerProps = {
  selectedDate: string | null; // "2026-10-22"
  timezone: string;
  onSelect: (date: string) => void;
};

const WEEK_DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarPicker({ selectedDate, timezone, onSelect }: CalendarPickerProps) {
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date()));

  // Compare dates as "YYYY-MM-DD" text: "2026-10-21" < "2026-10-22"
  const today = todayInTimezone(timezone);
  const isCurrentMonth = format(visibleMonth, 'yyyy-MM') <= today.slice(0, 7);

  // All the days shown in the grid (including a few from the previous/next month)
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(visibleMonth)),
    end: endOfWeek(endOfMonth(visibleMonth)),
  });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setVisibleMonth(addMonths(visibleMonth, -1))}
          disabled={isCurrentMonth}
          className="rounded p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
          aria-label="Previous month"
        >
          ‹
        </button>
        <h2 className="font-semibold">{format(visibleMonth, 'MMMM yyyy')}</h2>
        <button
          type="button"
          onClick={() => setVisibleMonth(addMonths(visibleMonth, 1))}
          className="rounded p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500">
        {WEEK_DAY_LABELS.map((label) => (
          <div key={label} className="py-1">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const value = format(day, 'yyyy-MM-dd');
          const isPast = value < today;
          const isOtherMonth = !isSameMonth(day, visibleMonth);
          const isSelected = value === selectedDate;

          if (isOtherMonth) {
            return <div key={value} />;
          }

          return (
            <button
              key={value}
              type="button"
              disabled={isPast}
              onClick={() => onSelect(value)}
              className={cn(
                'aspect-square rounded-full text-sm font-medium transition-colors',
                isSelected && 'bg-blue-600 text-white',
                !isSelected && !isPast && 'bg-blue-50 text-blue-700 hover:bg-blue-100',
                isPast && 'cursor-not-allowed text-slate-300',
              )}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}
