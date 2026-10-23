import { useState } from 'react';
import { Badge, Button, Card } from '@/components/ui';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { formatDuration } from '@/lib/date';
import { getPublicLink } from '@/lib/utils';
import { useEventTypesStore } from '../store';
import type { EventType } from '../types';

type EventTypeCardProps = {
  eventType: EventType;
  username: string;
  onEdit: (eventType: EventType) => void;
};

export function EventTypeCard({ eventType, username, onEdit }: EventTypeCardProps) {
  const updateEventType = useEventTypesStore((state) => state.updateEventType);
  const deleteEventType = useEventTypesStore((state) => state.deleteEventType);
  const { copied, copy } = useCopyToClipboard();
  const [isBusy, setIsBusy] = useState(false);

  const link = getPublicLink(username, eventType.slug);

  async function handleToggleActive() {
    setIsBusy(true);
    const result = await updateEventType(eventType.id, { isActive: !eventType.isActive });
    setIsBusy(false);
    if (!result.ok) alert(result.error);
  }

  async function handleDelete() {
    if (!confirm(`Delete "${eventType.title}"?`)) return;

    setIsBusy(true);
    const result = await deleteEventType(eventType.id);
    setIsBusy(false);
    if (!result.ok) alert(result.error);
  }

  return (
    <Card className={eventType.isActive ? 'border-t-4 border-t-blue-600' : 'opacity-70'}>
      <div className="mb-1 flex items-start justify-between gap-2">
        <h3 className="font-semibold">{eventType.title}</h3>
        <Badge color={eventType.isActive ? 'green' : 'gray'}>
          {eventType.isActive ? 'Active' : 'Off'}
        </Badge>
      </div>
      <p className="text-sm text-slate-500">{formatDuration(eventType.duration)}</p>
      {eventType.description && (
        <p className="mt-2 line-clamp-2 text-sm text-slate-600">{eventType.description}</p>
      )}

      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        className="mt-3 block truncate text-sm text-blue-600 hover:underline"
      >
        /{username}/{eventType.slug}
      </a>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => copy(link)}>
          {copied ? 'Copied!' : 'Copy link'}
        </Button>
        <Button size="sm" variant="outline" onClick={() => onEdit(eventType)}>
          Edit
        </Button>
        <Button size="sm" variant="ghost" onClick={handleToggleActive} disabled={isBusy}>
          {eventType.isActive ? 'Turn off' : 'Turn on'}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-red-600 hover:bg-red-50"
          onClick={handleDelete}
          disabled={isBusy}
        >
          Delete
        </Button>
      </div>
    </Card>
  );
}
