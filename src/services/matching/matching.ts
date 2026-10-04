import * as foundItemRepository from '@/repositories/foundItemRepository';
import * as lostItemRepository from '@/repositories/lostItemRepository';
import * as notificationService from '@/services/notifications/notifications';
import type { LostItemPost } from '@/types/lostItem';
import type { FoundItemPost } from '@/types/foundItem';
import { ForbiddenError, NotFoundError } from '@/errors/http-errors';

const MATCH_THRESHOLD = 0.6;

const normalizeWords = (...values: Array<string | null | undefined>) =>
  new Set(
    values
      .join(' ')
      .toLocaleLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((word) => word.length >= 3),
  );

const scoreMatch = (
  lostCategory: string,
  lostWords: Set<string>,
  foundCategory: string,
  foundWords: Set<string>,
) => {
  if (lostCategory.toLocaleLowerCase() !== foundCategory.toLocaleLowerCase()) {
    return 0;
  }

  const overlap = [...lostWords].filter((word) => foundWords.has(word)).length;
  if (overlap === 0) return 0;

  return 0.6 + 0.4 * Math.min(1, overlap / Math.max(1, lostWords.size));
};

const findMatchesForLostItem = async (lostItemId: string): Promise<FoundItemPost[]> => {
  const lostItem = await lostItemRepository.findLostItemById(lostItemId);
  if (!lostItem) throw new NotFoundError('Lost item not found');

  const lostWords = normalizeWords(lostItem.title, lostItem.description);
  const foundItems = await foundItemRepository.findAllFoundItems();

  return foundItems
    .filter((item) => item.status === 'OPEN')
    .map((item) => ({
      item,
      score: scoreMatch(
        lostItem.category,
        lostWords,
        item.category,
        normalizeWords(item.title, item.description),
      ),
    }))
    .filter(({ score }) => score >= MATCH_THRESHOLD)
    .sort((left, right) => right.score - left.score)
    .map(({ item }) => item);
};

const findMatchesForFoundItem = async (foundItemId: string): Promise<LostItemPost[]> => {
  const foundItem = await foundItemRepository.findFoundItemById(foundItemId);
  if (!foundItem) throw new NotFoundError('Found item not found');

  const foundWords = normalizeWords(foundItem.title, foundItem.description);
  const lostItems = await lostItemRepository.findAllLostItems();

  return lostItems
    .filter((item) => item.status === 'OPEN')
    .map((item) => ({
      item,
      score: scoreMatch(
        item.category,
        normalizeWords(item.title, item.description),
        foundItem.category,
        foundWords,
      ),
    }))
    .filter(({ score }) => score >= MATCH_THRESHOLD)
    .sort((left, right) => right.score - left.score)
    .map(({ item }) => item);
};

const getLostItemMatches = async (lostItemId: string, userId: string) => {
  const lostItem = await lostItemRepository.findLostItemById(lostItemId);
  if (!lostItem) throw new NotFoundError('Lost item not found');
  if (lostItem.userId !== userId) throw new ForbiddenError('You do not own this lost item');

  return { matches: await findMatchesForLostItem(lostItemId) };
};

const getFoundItemMatches = async (foundItemId: string, userId: string) => {
  const foundItem = await foundItemRepository.findFoundItemById(foundItemId);
  if (!foundItem) throw new NotFoundError('Found item not found');
  if (foundItem.userId !== userId) throw new ForbiddenError('You do not own this found item');

  return { matches: await findMatchesForFoundItem(foundItemId) };
};

const runMatching = async (itemId: string, userId: string) => {
  const foundItem = await foundItemRepository.findFoundItemById(itemId);
  if (foundItem) {
    if (foundItem.userId !== userId) throw new ForbiddenError('You do not own this found item');

    const matches = await findMatchesForFoundItem(itemId);
    await Promise.all(matches.map((match) => notificationService.notifyUser(
      match.userId,
      'We found a possible match for your item.',
      itemId,
    )));
    return { matchCount: matches.length };
  }

  const lostItem = await lostItemRepository.findLostItemById(itemId);
  if (!lostItem) throw new NotFoundError('Item not found');
  if (lostItem.userId !== userId) throw new ForbiddenError('You do not own this lost item');

  const matches = await findMatchesForLostItem(itemId);
  await Promise.all(matches.map((match) => notificationService.notifyUser(
    match.userId,
    'We found a possible match for your item.',
    match.id,
  )));
  return { matchCount: matches.length };
};

export { getFoundItemMatches, getLostItemMatches, runMatching };
