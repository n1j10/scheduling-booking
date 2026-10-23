import { formatDuration, formatFullDate, formatTime } from '@/lib/date';
import type { PublicEventType, Slot } from '../types';

type EventSummaryProps = {
  eventType: PublicEventType;
  selectedSlot: Slot | null;
  timezone: string;
};

export function EventSummary({ eventType, selectedSlot, timezone }: EventSummaryProps) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-500">
        {eventType.user.name ?? eventType.user.username}
      </p>
      <h1 className="mt-1 text-2xl font-bold">{eventType.title}</h1>
      <p className="mt-3 text-sm text-slate-600">⏱ {formatDuration(eventType.duration)}</p>

      {selectedSlot && (
        <p className="mt-2 text-sm font-medium text-blue-700">
          📅 {formatTime(selectedSlot.start, timezone)} – {formatTime(selectedSlot.end, timezone)},{' '}
          {formatFullDate(selectedSlot.start, timezone)}
        </p>
      )}

      {eventType.description && (
        <p className="mt-4 whitespace-pre-line text-sm text-slate-600">{eventType.description}</p>
      )}
    </div>
  );
}
