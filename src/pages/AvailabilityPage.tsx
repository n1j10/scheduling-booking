import { useState } from 'react';
import { Alert, Button, Card, Label, PageSpinner } from '@/components/ui';
import { TimezoneSelect } from '@/components/TimezoneSelect';
import { useCurrentUser, useProfileStore } from '@/features/auth';
import { useAvailability, WeeklyHoursEditor } from '@/features/availability';

export function AvailabilityPage() {
  const { profile } = useCurrentUser();
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const { isLoading, error, saveAvailability } = useAvailability();

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleTimezoneChange(timezone: string) {
    const result = await updateProfile({ timezone });
    setMessage(
      result.ok
        ? { type: 'success', text: 'Timezone updated' }
        : { type: 'error', text: result.error },
    );
  }

  async function handleSave() {
    setIsSaving(true);
    setMessage(null);
    const result = await saveAvailability();
    setIsSaving(false);

    setMessage(
      result.ok
        ? { type: 'success', text: 'Working hours saved' }
        : { type: 'error', text: result.error },
    );
  }

  if (isLoading || !profile) {
    return <PageSpinner />;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Availability</h1>

      {error && <Alert className="mb-4">{error}</Alert>}
      {message && (
        <Alert variant={message.type} className="mb-4">
          {message.text}
        </Alert>
      )}

      <Card className="mb-6">
        <Label htmlFor="timezone">Your timezone</Label>
        <TimezoneSelect id="timezone" value={profile.timezone} onChange={handleTimezoneChange} />
        <p className="mt-2 text-xs text-slate-500">
          Your working hours below are in this timezone. Visitors see times in their own timezone.
        </p>
      </Card>

      <Card>
        <h2 className="mb-2 font-semibold">Weekly hours</h2>
        <WeeklyHoursEditor />
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSave} isLoading={isSaving}>
            Save
          </Button>
        </div>
      </Card>
    </div>
  );
}
