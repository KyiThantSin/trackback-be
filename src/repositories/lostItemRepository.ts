import { db } from '@/../prisma/db';
import type {
  CreateLostItemPayload,
  LostItemPost,
  LostItemStatus,
  UpdateLostItemPayload,
} from '@/types/lostItem';

const findAllLostItems = async (): Promise<LostItemPost[]> => {
  const results = await db.orm.public.LostItemPost.all();

  return results.map((result) => ({
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
  }));
};

const findLostItemById = async (id: string): Promise<LostItemPost | null> => {
  const lostItemId = id as NonNullable<
    Awaited<ReturnType<typeof db.orm.public.LostItemPost.first>>
  >['id'];
  const result = await db.orm.public.LostItemPost.first({ id: lostItemId });

  if (!result) return null;

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

const updateLostItemStatus = async (id: string, status: LostItemStatus): Promise<void> => {
  const lostItemId = id as NonNullable<
    Awaited<ReturnType<typeof db.orm.public.LostItemPost.first>>
  >['id'];

  await db.orm.public.LostItemPost.where({ id: lostItemId }).update({ status });
};

const updateLostItem = async (id: string, data: UpdateLostItemPayload): Promise<void> => {
  const lostItemId = id as NonNullable<
    Awaited<ReturnType<typeof db.orm.public.LostItemPost.first>>
  >['id'];

  await db.orm.public.LostItemPost.where({ id: lostItemId }).update(data);
};

const deleteLostItem = async (id: string): Promise<void> => {
  const lostItemId = id as NonNullable<
    Awaited<ReturnType<typeof db.orm.public.LostItemPost.first>>
  >['id'];

  await db.orm.public.LostItemPost.where({ id: lostItemId }).delete();
};

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

export {
  createLostItem,
  deleteLostItem,
  findAllLostItems,
  findLostItemById,
  updateLostItem,
  updateLostItemStatus,
};
