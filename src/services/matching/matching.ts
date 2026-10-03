import * as matchingRepository from '@/repositories/matchingRepository';
import * as notificationService from '@/services/notifications/notifications';
import type { LostItemPost } from '@/types/lostItem';
import type { FoundItemPost } from '@/types/matching';
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
  foundCategory: string | null,
  foundWords: Set<string>,
) => {
  if (!foundCategory || lostCategory.toLocaleLowerCase() !== foundCategory.toLocaleLowerCase()) {
    return 0;
  }

  const overlap = [...lostWords].filter((word) => foundWords.has(word)).length;
  if (overlap === 0) return 0;

  return 0.6 + 0.4 * Math.min(1, overlap / Math.max(1, lostWords.size));
};

const toFoundItem = (post: Awaited<ReturnType<typeof matchingRepository.findFoundItems>>[number]): FoundItemPost => ({
  id: post.id,
  title: post.title,
  content: post.content,
  category: post.category,
  foundLocation: post.foundLocation,
  foundDate: post.foundDate,
  photoUrl: post.photoUrl,
  status: post.status,
  authorId: post.authorId,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
});

const toLostItem = (item: Awaited<ReturnType<typeof matchingRepository.findLostItems>>[number]): LostItemPost => ({
  id: item.id,
  title: item.title,
  description: item.description,
  category: item.category,
  lastSeenLocation: item.lastSeenLocation,
  lastSeenDate: item.lastSeenDate,
  status: item.status as LostItemPost['status'],
  photoUrl: item.photoUrl,
  userId: item.userId,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

const findMatchesForLostItem = async (lostItemId: string) => {
  const lostItem = await matchingRepository.findLostItemById(lostItemId);
  if (!lostItem) throw new NotFoundError('Lost item not found');

  const lostWords = normalizeWords(lostItem.title, lostItem.description);
  const foundItems = await matchingRepository.findFoundItems();

  return foundItems
    .filter((item) => item.status === 'OPEN')
    .map((item) => ({
      item,
      score: scoreMatch(lostItem.category, lostWords, item.category, normalizeWords(item.title, item.content)),
    }))
    .filter(({ score }) => score >= MATCH_THRESHOLD)
    .sort((left, right) => right.score - left.score)
    .map(({ item }) => toFoundItem(item));
};

const findMatchesForFoundItem = async (foundItemId: string) => {
  const foundItem = await matchingRepository.findFoundItemById(foundItemId);
  if (!foundItem) throw new NotFoundError('Found item not found');

  const foundWords = normalizeWords(foundItem.title, foundItem.content);
  const lostItems = await matchingRepository.findLostItems();

  return lostItems
    .filter((item) => item.status === 'OPEN')
    .map((item) => ({
      item,
      score: scoreMatch(item.category, normalizeWords(item.title, item.description), foundItem.category, foundWords),
    }))
    .filter(({ score }) => score >= MATCH_THRESHOLD)
    .sort((left, right) => right.score - left.score)
    .map(({ item }) => toLostItem(item));
};

const getLostItemMatches = async (lostItemId: string, userId: string) => {
  const lostItem = await matchingRepository.findLostItemById(lostItemId);
  if (!lostItem) throw new NotFoundError('Lost item not found');
  if (lostItem.userId !== userId) throw new ForbiddenError('You do not own this lost item');

  return { matches: await findMatchesForLostItem(lostItemId) };
};

const getFoundItemMatches = async (foundItemId: string, userId: string) => {
  const foundItem = await matchingRepository.findFoundItemById(foundItemId);
  if (!foundItem) throw new NotFoundError('Found item not found');
  if (foundItem.authorId !== userId) throw new ForbiddenError('You do not own this found item');

  return { matches: await findMatchesForFoundItem(foundItemId) };
};

const runMatching = async (postId: string, userId: string) => {
  const foundItem = await matchingRepository.findFoundItemById(postId);
  if (foundItem) {
    if (foundItem.authorId !== userId) throw new ForbiddenError('You do not own this found item');

    const matches = await findMatchesForFoundItem(postId);
    await Promise.all(matches.map((match) => notificationService.notifyUser(
      match.userId,
      'We found a possible match for your item.',
      postId,
    )));
    return { matchCount: matches.length };
  }

  const lostItem = await matchingRepository.findLostItemById(postId);
  if (!lostItem) throw new NotFoundError('Post not found');
  if (lostItem.userId !== userId) throw new ForbiddenError('You do not own this lost item');

  const matches = await findMatchesForLostItem(postId);
  await Promise.all(matches.map((match) => notificationService.notifyUser(
    match.authorId,
    'We found a possible match for your item.',
    match.id,
  )));
  return { matchCount: matches.length };
};

export { getFoundItemMatches, getLostItemMatches, runMatching };