import { db } from '@/../prisma/db';
import type { Models } from '@/../prisma/schema.d';
import type {
  CreateFoundItemPayload,
  FoundItemPost,
  FoundItemStatus,
  UpdateFoundItemPayload,
} from '@/types/foundItem';

const createFoundItem = async (data: CreateFoundItemPayload): Promise<FoundItemPost> => {
  const result = await db.orm.public.FoundItemPost.create({
    title: data.title,
    description: data.description,
    category: data.category,
    foundLocation: data.foundLocation,
    foundDate: data.foundDate,
    status: 'OPEN',
    photoUrl: data.photoUrl ?? null,
    userId: data.userId as any,
  });

  return {
    id: result.id,
    title: result.title,
    description: result.description,
    category: result.category,
    foundLocation: result.foundLocation,
    foundDate: result.foundDate,
    status: result.status as FoundItemPost['status'],
    photoUrl: result.photoUrl ?? null,
    userId: result.userId,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  };
};

const findAllFoundItems = async (): Promise<FoundItemPost[]> => {
  const results = await db.orm.public.FoundItemPost.all();

  return results.map((result) => ({
    id: result.id,
    title: result.title,
    description: result.description,
    category: result.category,
    foundLocation: result.foundLocation,
    foundDate: result.foundDate,
    status: result.status as FoundItemPost['status'],
    photoUrl: result.photoUrl ?? null,
    userId: result.userId,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  }));
};

const findByUserId = async (userId: string, limit: number): Promise<FoundItemPost[]> => {
  const results = await db.orm.public.FoundItemPost
    .where({ userId: userId as Models.public_FoundItemPost['userId'] })
    .orderBy((item) => item.createdAt.desc())
    .limit(limit)
    .all();

  return results.map((result) => ({
    id: result.id,
    title: result.title,
    description: result.description,
    category: result.category,
    foundLocation: result.foundLocation,
    foundDate: result.foundDate,
    status: result.status as FoundItemPost['status'],
    photoUrl: result.photoUrl ?? null,
    userId: result.userId,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  }));
};

const countByUserId = async (userId: string): Promise<number> => {
  const result = await db.orm.public.FoundItemPost
    .where({ userId: userId as Models.public_FoundItemPost['userId'] })
    .aggregate((aggregate) => ({ total: aggregate.count() }));

  return result.total;
};

const findFoundItemById = async (id: string): Promise<FoundItemPost | null> => {
  const foundItemId = id as NonNullable<
    Awaited<ReturnType<typeof db.orm.public.FoundItemPost.first>>
  >['id'];
  const result = await db.orm.public.FoundItemPost.first({ id: foundItemId });

  if (!result) return null;

  return {
    id: result.id,
    title: result.title,
    description: result.description,
    category: result.category,
    foundLocation: result.foundLocation,
    foundDate: result.foundDate,
    status: result.status as FoundItemPost['status'],
    photoUrl: result.photoUrl ?? null,
    userId: result.userId,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  };
};

const updateFoundItem = async (id: string, data: UpdateFoundItemPayload): Promise<void> => {
  const foundItemId = id as NonNullable<
    Awaited<ReturnType<typeof db.orm.public.FoundItemPost.first>>
  >['id'];

  await db.orm.public.FoundItemPost.where({ id: foundItemId }).update(data);
};

const updateFoundItemStatus = async (id: string, status: FoundItemStatus): Promise<void> => {
  const foundItemId = id as NonNullable<
    Awaited<ReturnType<typeof db.orm.public.FoundItemPost.first>>
  >['id'];

  await db.orm.public.FoundItemPost.where({ id: foundItemId }).update({ status });
};

const deleteFoundItem = async (id: string): Promise<void> => {
  const foundItemId = id as NonNullable<
    Awaited<ReturnType<typeof db.orm.public.FoundItemPost.first>>
  >['id'];

  await db.orm.public.FoundItemPost.where({ id: foundItemId }).delete();
};

export {
  createFoundItem,
  deleteFoundItem,
  countByUserId,
  findAllFoundItems,
  findByUserId,
  findFoundItemById,
  updateFoundItem,
  updateFoundItemStatus,
};