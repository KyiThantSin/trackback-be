export type FoundItemStatus = 'OPEN' | 'PENDING_CLAIM' | 'CLAIMED' | 'CLOSED';

export interface CreateFoundItemPayload {
  title: string;
  description: string;
  category: string;
  foundLocation: string;
  foundDate: string;
  photoUrl?: string | null;
  userId: string;
}

export interface FoundItemPost {
  id: string;
  title: string;
  description: string;
  category: string;
  foundLocation: string;
  foundDate: string;
  status: FoundItemStatus;
  photoUrl: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}