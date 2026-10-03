import type { LostItemPost } from '@/types/lostItem';

export interface FoundItemPost {
  id: string;
  title: string;
  content: string | null;
  category: string | null;
  foundLocation: string | null;
  foundDate: string | null;
  photoUrl: string | null;
  status: string | null;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MatchingResult<T> {
  matches: T[];
}

export type LostItemMatchResult = MatchingResult<FoundItemPost>;
export type FoundItemMatchResult = MatchingResult<LostItemPost>;