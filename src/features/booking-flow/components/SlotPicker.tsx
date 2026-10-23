import { Alert, Spinner } from '@/components/ui';
import { formatShortDate, formatTime } from '@/lib/date';
import { cn } from '@/lib/utils';
import { useBookingFlowStore } from '../store';

export function SlotPicker() {
  const { selectedDate, slots, isLoadingSlots, slotsError, selectedSlot, timezone, selectSlot } =
    useBookingFlowStore();

  if (!selectedDate) {
    return <p className="text-sm text-slate-500">Pick a date to see available times.</p>;
  }

  return (
    <div>
      <h3 className="mb-3 font-medium">
        {/* Noon avoids the date jumping a day when shown in another timezone */}
        {formatShortDate(`${selectedDate}T12:00:00Z`, 'UTC')}
      </h3>

      {isLoadingSlots && (
        <div className="flex justify-center py-6 text-blue-600">
          <Spinner />
        </div>
      )}

      {slotsError && <Alert>{slotsError}</Alert>}

      {!isLoadingSlots && !slotsError && slots.length === 0 && (
        <p className="text-sm text-slate-500">No available times on this day.</p>
      )}

      <div className="flex max-h-96 flex-col gap-2 overflow-y-auto pr-1">
        {slots.map((slot) => {
          const isSelected = selectedSlot?.start === slot.start;
          return (
            <button
              key={slot.start}
              type="button"
              onClick={() => selectSlot(slot)}
              className={cn(
                'rounded-md border py-2.5 text-sm font-semibold transition-colors',
                isSelected
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-blue-300 text-blue-700 hover:border-blue-600',
              )}
            >
              {formatTime(slot.start, timezone)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
