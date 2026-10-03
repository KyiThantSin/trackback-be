import type { CreateFoundItemPayload, FoundItemPost } from '@/types/foundItem';
import * as foundItemRepository from '@/repositories/foundItemRepository';

const createFoundItem = async (data: CreateFoundItemPayload): Promise<FoundItemPost> => {
  return foundItemRepository.createFoundItem({
    title: data.title.trim(),
    description: data.description.trim(),
    category: data.category.trim(),
    foundLocation: data.foundLocation.trim(),
    foundDate: data.foundDate,
    photoUrl: typeof data.photoUrl === 'string' ? data.photoUrl.trim() : data.photoUrl,
    userId: data.userId,
  });
};

export { createFoundItem };