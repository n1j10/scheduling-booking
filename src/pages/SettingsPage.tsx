import { useEffect, useState, type FormEvent } from 'react';
import { Alert, Button, Card, Input, Label, PageSpinner } from '@/components/ui';
import { useCurrentUser, useProfileStore } from '@/features/auth';
import { slugify } from '@/lib/utils';

export function SettingsPage() {
  const { profile } = useCurrentUser();
  const updateProfile = useProfileStore((state) => state.updateProfile);

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fill the form once the profile is loaded
  useEffect(() => {
    if (profile) {
      setName(profile.name ?? '');
      setUsername(profile.username);
    }
  }, [profile]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (username.length < 3) {
      setMessage({ type: 'error', text: 'Username must be at least 3 characters' });
      return;
    }

    setIsSaving(true);
    const result = await updateProfile({ name: name || null, username });
    setIsSaving(false);

    setMessage(
      result.ok ? { type: 'success', text: 'Settings saved' } : { type: 'error', text: result.error },
    );
  }

  if (!profile) return <PageSpinner />;

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          {message && <Alert variant={message.type}>{message.text}</Alert>}

          <div>
            <Label htmlFor="name">Display name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="username">Username</Label>
            <div className="flex items-center gap-1">
              <span className="text-sm text-slate-500">{window.location.origin}/</span>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(slugify(e.target.value))}
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Changing it breaks links you already shared.
            </p>
          </div>

          <div>
            <Label>Email</Label>
            <Input value={profile.email} disabled />
          </div>

          <div className="flex justify-end">
            <Button type="submit" isLoading={isSaving}>
              Save
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
