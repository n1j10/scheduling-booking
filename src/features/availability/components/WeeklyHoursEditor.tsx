import { Input } from '@/components/ui';
import { WEEK_DAYS } from '@/lib/date';
import { useAvailabilityStore } from '../store';

export function WeeklyHoursEditor() {
  const { rules, toggleDay, updateTime } = useAvailabilityStore();

  return (
    <div className="divide-y divide-slate-100">
      {WEEK_DAYS.map((dayName, dayOfWeek) => {
        const rule = rules.find((r) => r.dayOfWeek === dayOfWeek);

        return (
          <div key={dayName} className="flex flex-wrap items-center gap-4 py-3">
            <label className="flex w-36 cursor-pointer items-center gap-2 font-medium">
              <input
                type="checkbox"
                checked={Boolean(rule)}
                onChange={() => toggleDay(dayOfWeek)}
                className="size-4 accent-blue-600"
              />
              {dayName}
            </label>

            {rule ? (
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={rule.startTime}
                  onChange={(e) => updateTime(dayOfWeek, 'startTime', e.target.value)}
                  className="w-32"
                  aria-label={`${dayName} start time`}
                />
                <span className="text-slate-400">–</span>
                <Input
                  type="time"
                  value={rule.endTime}
                  onChange={(e) => updateTime(dayOfWeek, 'endTime', e.target.value)}
                  className="w-32"
                  aria-label={`${dayName} end time`}
                />
              </div>
            ) : (
              <span className="text-sm text-slate-400">Unavailable</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
