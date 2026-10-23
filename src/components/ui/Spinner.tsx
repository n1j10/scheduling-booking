import { cn } from '@/lib/utils';

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block size-6 animate-spin rounded-full border-2 border-current border-t-transparent',
        className,
      )}
    />
  );
}

export function PageSpinner() {
  return (
    <div className="flex justify-center py-20 text-blue-600">
      <Spinner className="size-8" />
    </div>
  );
}
