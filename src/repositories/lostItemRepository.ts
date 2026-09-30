import { db } from '@/../prisma/db';
import type { CreateLostItemPayload, LostItemPost } from '@/types/lostItem';

const createLostItem = async (data: CreateLostItemPayload): Promise<LostItemPost> => {
  const result = await db.orm.public.LostItemPost.create({
    title: data.title,
    description: data.description,
    category: data.category,
    lastSeenLocation: data.lastSeenLocation,
    lastSeenDate: data.lastSeenDate,
    status: 'OPEN',
    photoUrl: data.photoUrl ?? null,
    userId: data.userId as any,
  });

  return {
    id: result.id,
    title: result.title,
    description: result.description,
    category: result.category,
    lastSeenLocation: result.lastSeenLocation,
    lastSeenDate: result.lastSeenDate,
    status: result.status as LostItemPost['status'],
    photoUrl: result.photoUrl ?? null,
    userId: result.userId,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  };
};

export { createLostItem };
