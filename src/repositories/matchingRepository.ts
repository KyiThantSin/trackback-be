import { db } from '@/../prisma/db';
import type { Models } from '@/../prisma/schema.d';

export const findLostItemById = (id: string) =>
  db.orm.public.LostItemPost.first({
    id: id as Models.public_LostItemPost['id'],
  });

export const findFoundItemById = (id: string) =>
  db.orm.public.Post.first({
    id: id as Models.public_Post['id'],
  });

export const findLostItems = () => db.orm.public.LostItemPost.all();

export const findFoundItems = () => db.orm.public.Post.all();