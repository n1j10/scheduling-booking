import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Card, Label, PageSpinner } from '@/components/ui';
import { TimezoneSelect } from '@/components/TimezoneSelect';
import {
  BookingForm,
  CalendarPicker,
  EventSummary,
  SlotPicker,
  useBookingFlowStore,
} from '@/features/booking-flow';
import { NotFoundPage } from './NotFoundPage';

export function PublicBookingPage() {
  const { username, slug } = useParams();
  const navigate = useNavigate();

  const {
    eventType,
    isLoadingEvent,
    eventError,
    timezone,
    selectedDate,
    selectedSlot,
    isSubmitting,
    submitError,
    loadEventType,
    setTimezone,
    selectDate,
    selectSlot,
    submitBooking,
    reset,
  } = useBookingFlowStore();

  // Load the event when the page opens, clean the store when leaving
  useEffect(() => {
    if (username && slug) loadEventType(username, slug);
    return () => reset();
  }, [username, slug, loadEventType, reset]);

  async function handleSubmit(form: Parameters<typeof submitBooking>[0]) {
    const bookingId = await submitBooking(form);
    if (bookingId) {
      navigate(`/booking/${bookingId}`);
    }
  }

  if (eventError) return <NotFoundPage />;
  if (isLoadingEvent || !eventType) return <PageSpinner />;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Card className="grid gap-8 p-6 md:grid-cols-[1fr_2fr]">
        <div className="md:border-r md:border-slate-100 md:pr-6">
          <EventSummary eventType={eventType} selectedSlot={selectedSlot} timezone={timezone} />
        </div>

        {selectedSlot ? (
          // Step 2: details form
          <BookingForm
            isSubmitting={isSubmitting}
            error={submitError}
            onSubmit={handleSubmit}
            onBack={() => selectSlot(null)}
          />
        ) : (
          // Step 1: pick date + time
          <div>
            <h2 className="mb-4 text-lg font-semibold">Select a date &amp; time</h2>
            {submitError && <p className="mb-3 text-sm text-red-600">{submitError}</p>}

            <div className="grid gap-6 sm:grid-cols-[3fr_2fr]">
              <div>
                <CalendarPicker
                  selectedDate={selectedDate}
                  timezone={timezone}
                  onSelect={selectDate}
                />
                <div className="mt-6">
                  <Label htmlFor="visitor-timezone">Timezone</Label>
                  <TimezoneSelect id="visitor-timezone" value={timezone} onChange={setTimezone} />
                </div>
              </div>
              <SlotPicker />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
