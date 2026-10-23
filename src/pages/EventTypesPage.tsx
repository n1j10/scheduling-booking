import { useState } from 'react';
import { Alert, Button, Card, Modal, PageSpinner } from '@/components/ui';
import { useCurrentUser } from '@/features/auth';
import {
  EventTypeCard,
  EventTypeForm,
  useEventTypes,
  type EventType,
  type EventTypeInput,
} from '@/features/event-types';
import { getPublicLink } from '@/lib/utils';

export function EventTypesPage() {
  const { profile } = useCurrentUser();
  const { eventTypes, isLoading, error, createEventType, updateEventType } = useEventTypes();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<EventType | null>(null);

  function openCreateForm() {
    setEditing(null);
    setIsFormOpen(true);
  }

  function openEditForm(eventType: EventType) {
    setEditing(eventType);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditing(null);
  }

  async function handleSubmit(values: EventTypeInput) {
    const result = editing
      ? await updateEventType(editing.id, values)
      : await createEventType(values);

    if (result.ok) closeForm();
    return result;
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Event Types</h1>
          {profile && (
            <a
              href={getPublicLink(profile.username)}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              {getPublicLink(profile.username)}
            </a>
          )}
        </div>
        <Button onClick={openCreateForm}>+ New event type</Button>
      </div>

      {error && <Alert className="mb-4">{error}</Alert>}

      {isLoading && eventTypes.length === 0 ? (
        <PageSpinner />
      ) : eventTypes.length === 0 ? (
        <Card className="py-12 text-center">
          <p className="text-slate-600">You don&apos;t have any event types yet.</p>
          <Button className="mt-4" onClick={openCreateForm}>
            Create your first one
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {eventTypes.map((eventType) => (
            <EventTypeCard
              key={eventType.id}
              eventType={eventType}
              username={profile?.username ?? ''}
              onEdit={openEditForm}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isFormOpen}
        title={editing ? 'Edit event type' : 'New event type'}
        onClose={closeForm}
      >
        {/* key resets the form state when switching between create / edit */}
        <EventTypeForm
          key={editing?.id ?? 'new'}
          eventType={editing}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      </Modal>
    </div>
  );
}
