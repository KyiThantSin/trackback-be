import * as foundItemRepository from '@/repositories/foundItemRepository';
import * as lostItemRepository from '@/repositories/lostItemRepository';
import type {
  BrowseItem,
  BrowseItemsQuery,
  BrowseItemsResult,
} from '@/types/browseItem';

const browseItems = async (query: BrowseItemsQuery): Promise<BrowseItemsResult> => {
  const items: BrowseItem[] = [];

  if (!query.type || query.type === 'lost' || query.type === 'all') {
    const lostItems = await lostItemRepository.findAllLostItems();
    items.push(...lostItems.map((item) => ({ ...item, type: 'lost' as const })));
  }

  if (!query.type || query.type === 'found' || query.type === 'all') {
    const foundItems = await foundItemRepository.findAllFoundItems();
    items.push(...foundItems.map((item) => ({ ...item, type: 'found' as const })));
  }

  const keyword = query.keyword?.toLocaleLowerCase();
  const category = query.category?.toLocaleLowerCase();
  const location = query.location?.toLocaleLowerCase();
  const dateFrom = query.dateFrom ? Date.parse(query.dateFrom) : undefined;
  const dateTo = query.dateTo ? Date.parse(query.dateTo) : undefined;

  const filteredItems = items.filter((item) => {
    const locationValue =
      item.type === 'lost' ? item.lastSeenLocation : item.foundLocation;
    const dateValue = item.type === 'lost' ? item.lastSeenDate : item.foundDate;
    const searchableText = [
      item.title,
      item.description,
      item.category,
      locationValue,
    ];

    return (
      (!keyword ||
        searchableText.some((value) =>
          value.toLocaleLowerCase().includes(keyword),
        )) &&
      (!category || item.category.toLocaleLowerCase() === category) &&
      (!location || locationValue.toLocaleLowerCase().includes(location)) &&
      (dateFrom === undefined || Date.parse(dateValue) >= dateFrom) &&
      (dateTo === undefined || Date.parse(dateValue) <= dateTo)
    );
  });

  const offset = (query.page - 1) * query.limit;

  return {
    items: filteredItems.slice(offset, offset + query.limit),
    total: filteredItems.length,
    page: query.page,
  };
};

export { browseItems };
