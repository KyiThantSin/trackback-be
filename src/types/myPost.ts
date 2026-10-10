import type { FoundItemStatus } from '@/types/foundItem';
import type { LostItemStatus } from '@/types/lostItem';

export type MyPostType = 'LOST' | 'FOUND';

export interface MyPost {
  id: string;
  postType: MyPostType;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  status: LostItemStatus | FoundItemStatus;
  photoUrl: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MyPostsResult {
  items: MyPost[];
  total: number;
  page: number;
  limit: number;
}
