import { db } from '@/../prisma/db';
import type { Models } from '@/../prisma/schema.d';
import type { ClaimStatus } from '@/types/claim';

type ClaimId = Models.public_Claim['id'];

const asClaimId = (id: string) => id as ClaimId;

export const findById = (id: string) => db.orm.public.Claim.first({ id: asClaimId(id) });

export const findPendingByClaimantAndPost = (claimantUserId: string, foundItemPostId: string) =>
  db.orm.public.Claim.first({
    claimantUserId: asClaimId(claimantUserId),
    foundItemPostId: asClaimId(foundItemPostId),
    status: 'PENDING',
  });

export const create = (data: {
  id: string;
  status: ClaimStatus;
  justification: string;
  itemDetails: string;
  proofPhotoUrl?: string;
  foundItemPostId: string;
  claimantUserId: string;
}) => db.orm.public.Claim.create({
  ...data,
  id: asClaimId(data.id),
  foundItemPostId: asClaimId(data.foundItemPostId),
  claimantUserId: asClaimId(data.claimantUserId),
});

export const updateStatus = (id: string, status: ClaimStatus) =>
  db.orm.public.Claim.where({ id: asClaimId(id) }).update({
    status,
    updatedAt: new Date().toISOString(),
  });

export const findByClaimant = (claimantUserId: string) =>
  db.orm.public.Claim.where({ claimantUserId: asClaimId(claimantUserId) });

export const findByPost = (foundItemPostId: string) =>
  db.orm.public.Claim.where({ foundItemPostId: asClaimId(foundItemPostId) });

export const findByPostAndStatus = (foundItemPostId: string, status: ClaimStatus) =>
  db.orm.public.Claim.where({ foundItemPostId: asClaimId(foundItemPostId), status });

export const findMine = (
  claimantUserId: string,
  status: ClaimStatus | undefined,
  page: number,
  limit: number,
) => {
  const query = db.orm.public.Claim.where({ claimantUserId: asClaimId(claimantUserId) });
  const filtered = status ? query.where({ status }) : query;

  return filtered
    .orderBy((claim) => claim.createdAt.desc())
    .offset((page - 1) * limit)
    .limit(limit)
    .all();
};

export const findToReview = (
  finderUserId: string,
  status: ClaimStatus | undefined,
  page: number,
  limit: number,
) => {
  const query = db.orm.public.Claim
    .where((claim) => claim.foundItem.some((post) => post.authorId.eq(finderUserId as Models.public_Post['authorId'])));
  const filtered = status ? query.where({ status }) : query;

  return filtered
    .include('foundItem')
    .orderBy((claim) => claim.createdAt.desc())
    .offset((page - 1) * limit)
    .limit(limit)
    .all();
};

export const countMine = (claimantUserId: string, status?: ClaimStatus) => {
  const query = db.orm.public.Claim.where({ claimantUserId: asClaimId(claimantUserId) });
  return (status ? query.where({ status }) : query).aggregate((aggregate) => ({ total: aggregate.count() }));
};

export const countToReview = (finderUserId: string, status?: ClaimStatus) => {
  const query = db.orm.public.Claim
    .where((claim) => claim.foundItem.some((post) => post.authorId.eq(finderUserId as Models.public_Post['authorId'])));
  return (status ? query.where({ status }) : query).aggregate((aggregate) => ({ total: aggregate.count() }));
};

export const findDetailById = (id: string) =>
  db.orm.public.Claim
    .include('foundItem')
    .include('claimant')
    .first({ id: asClaimId(id) });