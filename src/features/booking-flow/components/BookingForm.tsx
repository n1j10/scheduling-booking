import { useState, type FormEvent } from 'react';
import { Alert, Button, Input, Label, Textarea } from '@/components/ui';
import type { BookingFormData } from '../types';

type BookingFormProps = {
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (form: BookingFormData) => void;
  onBack: () => void;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function BookingForm({ isSubmitting, error, onSubmit, onBack }: BookingFormProps) {
  const [form, setForm] = useState<BookingFormData>({
    clientName: '',
    clientEmail: '',
    clientNotes: '',
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!form.clientName.trim()) {
      setValidationError('Please enter your name');
      return;
    }
    if (!EMAIL_REGEX.test(form.clientEmail)) {
      setValidationError('Please enter a valid email');
      return;
    }

    setValidationError(null);
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-semibold">Enter details</h3>

      {(validationError || error) && <Alert>{validationError ?? error}</Alert>}

      <div>
        <Label htmlFor="clientName">Name *</Label>
        <Input
          id="clientName"
          value={form.clientName}
          onChange={(e) => setForm({ ...form, clientName: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="clientEmail">Email *</Label>
        <Input
          id="clientEmail"
          type="email"
          value={form.clientEmail}
          onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="clientNotes">Anything that will help prepare for the meeting?</Label>
        <Textarea
          id="clientNotes"
          value={form.clientNotes}
          onChange={(e) => setForm({ ...form, clientNotes: e.target.value })}
        />
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Schedule event
        </Button>
      </div>
    </form>
  );
}
