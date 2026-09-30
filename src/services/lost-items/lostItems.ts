import type { CreateLostItemPayload, LostItemPost } from '@/types/lostItem';
import * as lostItemRepository from '@/repositories/lostItemRepository';

const createLostItem = async (data: CreateLostItemPayload): Promise<LostItemPost> => {
  return lostItemRepository.createLostItem({
    title: data.title.trim(),
    description: data.description.trim(),
    category: data.category.trim(),
    lastSeenLocation: data.lastSeenLocation.trim(),
    lastSeenDate: data.lastSeenDate,
    photoUrl: data.photoUrl?.trim(),
    userId: data.userId,
  });
};

export { createLostItem };
