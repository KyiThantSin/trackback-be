export type LostItemStatus = 'OPEN' | 'RECOVERED' | 'CLOSED';

export interface CreateLostItemPayload {
  title: string;
  description: string;
  category: string;
  lastSeenLocation: string;
  lastSeenDate: string;
  photoUrl?: string;
  userId: string;
}

export interface LostItemPost {
  id: string;
  title: string;
  description: string;
  category: string;
  lastSeenLocation: string;
  lastSeenDate: string;
  status: LostItemStatus;
  photoUrl: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
