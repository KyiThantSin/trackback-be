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

export interface UpdateFoundItemPayload {
  title?: string;
  description?: string;
  category?: string;
  foundLocation?: string;
  foundDate?: string;
  photoUrl?: string | null;
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

export interface ListFoundItemsQuery {
  keyword?: string;
  category?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: FoundItemStatus;
  page: number;
  limit: number;
}

export interface ListFoundItemsResult {
  items: FoundItemPost[];
  total: number;
  page: number;
}