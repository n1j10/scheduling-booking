import { useState } from 'react';
import { Badge, Button, Card } from '@/components/ui';
import { formatShortDate, formatTime } from '@/lib/date';
import { useBookingsStore } from '../store';
import type { Booking } from '../types';

type BookingItemProps = {
  booking: Booking;
  timezone: string; // provider's timezone - all times are shown in it
};

export function BookingItem({ booking, timezone }: BookingItemProps) {
  const cancelBooking = useBookingsStore((state) => state.cancelBooking);
  const [isCancelling, setIsCancelling] = useState(false);

  const isCancelled = booking.status === 'CANCELLED';
  const isFuture = new Date(booking.startTime).getTime() > Date.now();

  async function handleCancel() {
    if (!confirm(`Cancel the meeting with ${booking.clientName}?`)) return;

    setIsCancelling(true);
    const result = await cancelBooking(booking.id);
    setIsCancelling(false);
    if (!result.ok) alert(result.error);
  }

  return (
    <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="sm:w-44">
        <p className="font-medium">{formatShortDate(booking.startTime, timezone)}</p>
        <p className="text-sm text-slate-500">
          {formatTime(booking.startTime, timezone)} – {formatTime(booking.endTime, timezone)}
        </p>
      </div>

      <div className="flex-1">
        <p className="font-medium">
          {booking.clientName}{' '}
          {isCancelled && <Badge color="red">Cancelled</Badge>}
        </p>
        <p className="text-sm text-slate-500">
          {booking.eventType.title} · {booking.clientEmail}
        </p>
        {booking.clientNotes && (
          <p className="mt-1 text-sm text-slate-600">“{booking.clientNotes}”</p>
        )}
      </div>

      {!isCancelled && isFuture && (
        <Button size="sm" variant="outline" onClick={handleCancel} isLoading={isCancelling}>
          Cancel
        </Button>
      )}
    </Card>
  );
}
