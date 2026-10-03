import type {
  CreateFoundItemPayload,
  FoundItemPost,
  ListFoundItemsQuery,
  ListFoundItemsResult,
} from '@/types/foundItem';
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

export { createFoundItem, listFoundItems };