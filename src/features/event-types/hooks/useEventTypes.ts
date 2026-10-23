import { useEffect } from 'react';
import { useEventTypesStore } from '../store';

// Loads the provider's event types when the page opens
export function useEventTypes() {
  const store = useEventTypesStore();
  const fetchEventTypes = useEventTypesStore((state) => state.fetchEventTypes);

  useEffect(() => {
    fetchEventTypes();
  }, [fetchEventTypes]);

  return store;
}
