import type { FoundItemPost } from '@/types/foundItem';
import type { LostItemPost } from '@/types/lostItem';

export type BrowseItemType = 'lost' | 'found' | 'all';

export interface BrowseItemsQuery {
  keyword?: string;
  category?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  type?: BrowseItemType;
  page: number;
  limit: number;
}

export type BrowseItem =
  | (LostItemPost & { type: 'lost' })
  | (FoundItemPost & { type: 'found' });

export interface BrowseItemsResult {
  items: BrowseItem[];
  total: number;
  page: number;
}
