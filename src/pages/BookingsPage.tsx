import { Alert, Card, PageSpinner } from '@/components/ui';
import { useCurrentUser } from '@/features/auth';
import { BookingFilterTabs, BookingItem, useBookings } from '@/features/bookings';

export function BookingsPage() {
  const { profile } = useCurrentUser();
  const { bookings, isLoading, error } = useBookings();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Bookings</h1>

      <BookingFilterTabs />

      {error && <Alert className="mb-4">{error}</Alert>}

      {isLoading || !profile ? (
        <PageSpinner />
      ) : bookings.length === 0 ? (
        <Card className="py-12 text-center text-slate-500">No bookings here.</Card>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <BookingItem key={booking.id} booking={booking} timezone={profile.timezone} />
          ))}
        </div>
      )}
    </div>
  );
}
