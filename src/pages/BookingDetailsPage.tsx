import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { Alert, Badge, Button, Card, PageSpinner } from '@/components/ui';
import { useBookingDetails } from '@/features/booking-flow';
import { formatDuration, formatFullDate, formatTime } from '@/lib/date';
import { NotFoundPage } from './NotFoundPage';

// Shown right after booking, and from the link in the confirmation email
export function BookingDetailsPage() {
  const { bookingId } = useParams();
  const { booking, isLoading, error, cancel } = useBookingDetails(bookingId);

  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  async function handleCancel() {
    if (!confirm('Are you sure you want to cancel this meeting?')) return;

    setIsCancelling(true);
    const result = await cancel();
    setIsCancelling(false);
    if (!result.ok) setCancelError(result.error);
  }

  if (isLoading) return <PageSpinner />;
  if (error || !booking) return <NotFoundPage />;

  const isCancelled = booking.status === 'CANCELLED';
  const isFuture = new Date(booking.startTime).getTime() > Date.now();
  const timezone = booking.clientTimezone;

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <Card className="text-center">
        <div className="mb-4 text-4xl">{isCancelled ? '❌' : '✅'}</div>
        <h1 className="text-xl font-bold">
          {isCancelled ? 'This meeting was cancelled' : 'You are scheduled'}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {isCancelled
            ? 'Both of you have been notified.'
            : 'A confirmation email has been sent to you.'}
        </p>

        <div className="mt-6 space-y-2 rounded-md border border-slate-200 p-4 text-left text-sm">
          <p className="flex items-center gap-2 font-semibold">
            {booking.eventType.title}
            <Badge color={isCancelled ? 'red' : 'green'}>{booking.status.toLowerCase()}</Badge>
          </p>
          <p>👤 {booking.host.name ?? booking.host.username}</p>
          <p>
            📅 {formatTime(booking.startTime, timezone)} – {formatTime(booking.endTime, timezone)},{' '}
            {formatFullDate(booking.startTime, timezone)}
          </p>
          <p>🌍 {timezone.replace(/_/g, ' ')}</p>
          <p>⏱ {formatDuration(booking.eventType.duration)}</p>
        </div>

        {cancelError && <Alert className="mt-4">{cancelError}</Alert>}

        <div className="mt-6 flex justify-center gap-2">
          {!isCancelled && isFuture && (
            <Button variant="outline" onClick={handleCancel} isLoading={isCancelling}>
              Cancel meeting
            </Button>
          )}
          <Link
            to={`/${booking.host.username}/${booking.eventType.slug}`}
            className="inline-flex h-10 items-center rounded-md px-4 text-sm font-medium text-blue-600 hover:bg-blue-50"
          >
            Book another time
          </Link>
        </div>
      </Card>
    </div>
  );
}
