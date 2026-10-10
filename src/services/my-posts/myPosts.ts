import * as foundItemRepository from '@/repositories/foundItemRepository';
import * as lostItemRepository from '@/repositories/lostItemRepository';
import type { MyPost, MyPostsResult } from '@/types/myPost';

const listMyPosts = async (
  userId: string,
  page: number,
  limit: number,
): Promise<MyPostsResult> => {
  const offset = (page - 1) * limit;
  const windowSize = offset + limit;

  const [lostItems, foundItems, lostTotal, foundTotal] = await Promise.all([
    lostItemRepository.findByUserId(userId, windowSize),
    foundItemRepository.findByUserId(userId, windowSize),
    lostItemRepository.countByUserId(userId),
    foundItemRepository.countByUserId(userId),
  ]);

  const posts: MyPost[] = [
    ...lostItems.map((item) => ({
      id: item.id,
      postType: 'LOST' as const,
      title: item.title,
      description: item.description,
      category: item.category,
      location: item.lastSeenLocation,
      date: item.lastSeenDate,
      status: item.status,
      photoUrl: item.photoUrl,
      userId: item.userId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })),
    ...foundItems.map((item) => ({
      id: item.id,
      postType: 'FOUND' as const,
      title: item.title,
      description: item.description,
      category: item.category,
      location: item.foundLocation,
      date: item.foundDate,
      status: item.status,
      photoUrl: item.photoUrl,
      userId: item.userId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })),
  ];

  posts.sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt) ||
    left.postType.localeCompare(right.postType) ||
    left.id.localeCompare(right.id),
  );

  return {
    items: posts.slice(offset, offset + limit),
    total: lostTotal + foundTotal,
    page,
    limit,
  };
};

export { listMyPosts };
