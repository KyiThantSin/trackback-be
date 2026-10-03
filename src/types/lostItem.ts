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

export interface UpdateLostItemPayload {
  title?: string;
  description?: string;
  category?: string;
  lastSeenLocation?: string;
  lastSeenDate?: string;
  photoUrl?: string | null;
}

export interface ListLostItemsQuery {
  keyword?: string;
  category?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: LostItemStatus;
  page: number;
  limit: number;
}

export interface ListLostItemsResult {
  items: LostItemPost[];
  total: number;
  page: number;
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
