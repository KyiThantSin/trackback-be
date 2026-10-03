import type {
  CreateFoundItemPayload,
  FoundItemPost,
  ListFoundItemsQuery,
  ListFoundItemsResult,
  UpdateFoundItemPayload,
} from '@/types/foundItem';
import * as foundItemRepository from '@/repositories/foundItemRepository';
import { ForbiddenError, NotFoundError } from '@/errors/http-errors';

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

const listFoundItems = async (query: ListFoundItemsQuery): Promise<ListFoundItemsResult> => {
  const allItems = await foundItemRepository.findAllFoundItems();
  const keyword = query.keyword?.toLocaleLowerCase();
  const category = query.category?.toLocaleLowerCase();
  const location = query.location?.toLocaleLowerCase();

  const filteredItems = allItems.filter((item) => {
    const itemDate = Date.parse(item.foundDate);
    const matchesKeyword = !keyword || [
      item.title,
      item.description,
      item.category,
      item.foundLocation,
    ].some((value) => value.toLocaleLowerCase().includes(keyword));

    return matchesKeyword &&
      (!category || item.category.toLocaleLowerCase() === category) &&
      (!location || item.foundLocation.toLocaleLowerCase().includes(location)) &&
      (!query.dateFrom || itemDate >= Date.parse(query.dateFrom)) &&
      (!query.dateTo || itemDate <= Date.parse(query.dateTo)) &&
      (!query.status || item.status === query.status);
  });

  const offset = (query.page - 1) * query.limit;

  return {
    items: filteredItems.slice(offset, offset + query.limit),
    total: filteredItems.length,
    page: query.page,
  };
};

const getFoundItemById = async (id: string): Promise<FoundItemPost> => {
  const foundItem = await foundItemRepository.findFoundItemById(id);

  if (!foundItem) {
    throw new NotFoundError('Found item not found');
  }

  return foundItem;
};

const updateFoundItem = async (
  id: string,
  userId: string,
  data: UpdateFoundItemPayload,
): Promise<FoundItemPost> => {
  const foundItem = await foundItemRepository.findFoundItemById(id);

  if (!foundItem) {
    throw new NotFoundError('Found item not found');
  }
  if (foundItem.userId !== userId) {
    throw new ForbiddenError('You do not own this found item');
  }

  const updates: UpdateFoundItemPayload = { ...data };
  if (data.title !== undefined) updates.title = data.title.trim();
  if (data.description !== undefined) updates.description = data.description.trim();
  if (data.category !== undefined) updates.category = data.category.trim();
  if (data.foundLocation !== undefined) updates.foundLocation = data.foundLocation.trim();

  await foundItemRepository.updateFoundItem(id, updates);

  const updatedFoundItem = await foundItemRepository.findFoundItemById(id);
  if (!updatedFoundItem) {
    throw new NotFoundError('Found item not found');
  }

  return updatedFoundItem;
};

export { createFoundItem, getFoundItemById, listFoundItems, updateFoundItem };