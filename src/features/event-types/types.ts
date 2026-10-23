export type EventType = {
  id: string;
  title: string;
  description: string | null;
  duration: number; // minutes
  slug: string;
  bufferBefore: number; // minutes
  bufferAfter: number; // minutes
  isActive: boolean;
  createdAt: string;
};

// What the create/edit form sends to the API
export type EventTypeInput = {
  title: string;
  description: string;
  duration: number;
  slug: string;
  bufferBefore: number;
  bufferAfter: number;
};

export type UpdateEventTypeInput = Partial<EventTypeInput> & { isActive?: boolean };
