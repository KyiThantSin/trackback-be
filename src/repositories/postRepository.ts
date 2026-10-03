import { db } from '@/../prisma/db';
import type { Models } from '@/../prisma/schema.d';

export const findById = (id: string) =>
  db.orm.public.Post.first({ id: id as Models.public_Post['id'] });

export const findAll = () => db.orm.public.Post.all();

export const update = (id: string, data: { status?: string; claimedById?: string }) =>
  db.orm.public.Post.where({ id: id as Models.public_Post['id'] }).update({
    ...data,
    claimedById: data.claimedById as Models.public_Post['claimedById'],
    updatedAt: new Date().toISOString(),
  });