import type {
  CreateLostItemPayload,
  ListLostItemsQuery,
  ListLostItemsResult,
  LostItemPost,
} from '@/types/lostItem';
import * as lostItemRepository from '@/repositories/lostItemRepository';
import { ConflictError, ForbiddenError, NotFoundError } from '@/errors/http-errors';

const recoverLostItem = async (
  id: string,
  userId: string,
): Promise<{ success: true; status: 'RECOVERED' }> => {
  const lostItem = await lostItemRepository.findLostItemById(id);

  if (!lostItem) {
    throw new NotFoundError('Lost item not found');
  }
  if (lostItem.userId !== userId) {
    throw new ForbiddenError('You do not own this lost item');
  }
  if (lostItem.status !== 'OPEN') {
    throw new ConflictError('Post Already Closed');
  }

  await lostItemRepository.updateLostItemStatus(id, 'RECOVERED');
  return { success: true, status: 'RECOVERED' };
};

const getLostItemById = async (id: string): Promise<LostItemPost> => {
  const lostItem = await lostItemRepository.findLostItemById(id);

  if (!lostItem) {
    throw new NotFoundError('Lost item not found');
  }

  return lostItem;
};

const listLostItems = async (query: ListLostItemsQuery): Promise<ListLostItemsResult> => {
  const allItems = await lostItemRepository.findAllLostItems();
  const keyword = query.keyword?.toLocaleLowerCase();
  const category = query.category?.toLocaleLowerCase();
  const location = query.location?.toLocaleLowerCase();

  const filteredItems = allItems.filter((item) => {
    const itemDate = Date.parse(item.lastSeenDate);
    const matchesKeyword = !keyword || [
      item.title,
      item.description,
      item.category,
      item.lastSeenLocation,
    ].some((value) => value.toLocaleLowerCase().includes(keyword));

    return matchesKeyword &&
      (!category || item.category.toLocaleLowerCase() === category) &&
      (!location || item.lastSeenLocation.toLocaleLowerCase().includes(location)) &&
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

export { createLostItem, getLostItemById, listLostItems, recoverLostItem };
