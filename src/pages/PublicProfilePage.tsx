import { Link, useParams } from 'react-router';
import { Card, PageSpinner } from '@/components/ui';
import { usePublicProfile } from '@/features/booking-flow';
import { formatDuration } from '@/lib/date';
import { NotFoundPage } from './NotFoundPage';

export function PublicProfilePage() {
  const { username } = useParams();
  const { profile, isLoading, error } = usePublicProfile(username);

  if (isLoading) return <PageSpinner />;
  if (error || !profile) return <NotFoundPage />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">{profile.name ?? profile.username}</h1>
        <p className="mt-1 text-slate-500">Pick an event to book a time with me.</p>
      </div>

      {profile.eventTypes.length === 0 ? (
        <Card className="text-center text-slate-500">No events available right now.</Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {profile.eventTypes.map((eventType) => (
            <Link key={eventType.id} to={`/${profile.username}/${eventType.slug}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <h2 className="font-semibold">{eventType.title}</h2>
                <p className="text-sm text-slate-500">{formatDuration(eventType.duration)}</p>
                {eventType.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                    {eventType.description}
                  </p>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
