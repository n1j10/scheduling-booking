import { useState, type FormEvent } from 'react';
import { Alert, Button, Input, Label, Select, Textarea } from '@/components/ui';
import { slugify } from '@/lib/utils';
import type { ActionResult } from '@/types';
import type { EventType, EventTypeInput } from '../types';

const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120];
const BUFFER_OPTIONS = [0, 5, 10, 15, 30, 60];

type EventTypeFormProps = {
  eventType?: EventType | null; // when passed, the form is in "edit" mode
  onSubmit: (values: EventTypeInput) => Promise<ActionResult>;
  onCancel: () => void;
};

export function EventTypeForm({ eventType, onSubmit, onCancel }: EventTypeFormProps) {
  const isEditMode = Boolean(eventType);

  const [values, setValues] = useState<EventTypeInput>({
    title: eventType?.title ?? '',
    description: eventType?.description ?? '',
    duration: eventType?.duration ?? 30,
    slug: eventType?.slug ?? '',
    bufferBefore: eventType?.bufferBefore ?? 0,
    bufferAfter: eventType?.bufferAfter ?? 0,
  });
  // In create mode the slug follows the title until the user edits it by hand
  const [slugTouched, setSlugTouched] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleTitleChange(title: string) {
    setValues({
      ...values,
      title,
      slug: slugTouched ? values.slug : slugify(title),
    });
  }

  function handleSlugChange(slug: string) {
    setSlugTouched(true);
    setValues({ ...values, slug: slugify(slug) });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!values.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!values.slug) {
      setError('URL slug is required');
      return;
    }

    setIsSubmitting(true);
    const result = await onSubmit(values);
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert>{error}</Alert>}

      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={values.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="30 Minute Meeting"
        />
      </div>

      <div>
        <Label htmlFor="slug">URL slug</Label>
        <Input
          id="slug"
          value={values.slug}
          onChange={(e) => handleSlugChange(e.target.value)}
          placeholder="30-minute-meeting"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={values.description}
          onChange={(e) => setValues({ ...values, description: e.target.value })}
          placeholder="What is this meeting about?"
        />
      </div>

      <div>
        <Label htmlFor="duration">Duration</Label>
        <Select
          id="duration"
          value={values.duration}
          onChange={(e) => setValues({ ...values, duration: Number(e.target.value) })}
        >
          {DURATION_OPTIONS.map((minutes) => (
            <option key={minutes} value={minutes}>
              {minutes} minutes
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="bufferBefore">Buffer before</Label>
          <Select
            id="bufferBefore"
            value={values.bufferBefore}
            onChange={(e) => setValues({ ...values, bufferBefore: Number(e.target.value) })}
          >
            {BUFFER_OPTIONS.map((minutes) => (
              <option key={minutes} value={minutes}>
                {minutes} min
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="bufferAfter">Buffer after</Label>
          <Select
            id="bufferAfter"
            value={values.bufferAfter}
            onChange={(e) => setValues({ ...values, bufferAfter: Number(e.target.value) })}
          >
            {BUFFER_OPTIONS.map((minutes) => (
              <option key={minutes} value={minutes}>
                {minutes} min
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {isEditMode ? 'Save changes' : 'Create'}
        </Button>
      </div>
    </form>
  );
}
