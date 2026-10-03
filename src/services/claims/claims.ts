import { randomUUID } from 'node:crypto';
import * as claimRepository from '@/repositories/claimRepository';
import * as notificationRepository from '@/repositories/notificationRepository';
import * as postRepository from '@/repositories/postRepository';
import * as userRepository from '@/repositories/userRepository';
import type {
  ClaimDetailResponse,
  ClaimListQuery,
  ClaimResponse,
  ClaimsListResponse,
  ClaimStatus,
  ReviewDecision,
  SubmitClaimRequest,
} from '@/types/claim';
import { ClaimError, ForbiddenError, NotFoundError } from '@/utils/errors';

const toClaimResponse = (claim: {
  id: string;
  status: string;
  justification: string;
  itemDetails: string;
  proofPhotoUrl: string | null;
  foundItemPostId: string;
  claimantUserId: string;
  createdAt: string;
  updatedAt: string;
}): ClaimResponse => ({
  id: claim.id,
  status: claim.status as ClaimStatus,
  justification: claim.justification,
  itemDetails: claim.itemDetails,
  proofPhotoUrl: claim.proofPhotoUrl,
  foundItemPostId: claim.foundItemPostId,
  claimantUserId: claim.claimantUserId,
  createdAt: claim.createdAt,
  updatedAt: claim.updatedAt,
});

const submitClaim = async (
  foundItemPostId: string,
  request: SubmitClaimRequest,
  claimantUserId: string,
): Promise<ClaimResponse> => {
  const claimant = await userRepository.findById(claimantUserId);
  if (!claimant) {
    throw new NotFoundError('User not found');
  }

  const foundItem = await postRepository.findById(foundItemPostId);
  if (!foundItem) {
    throw new ClaimError(404, 'FOUND_POST_NOT_FOUND', 'Found item post not found');
  }
  if (foundItem.status !== 'OPEN') {
    throw new ClaimError(409, 'POST_ALREADY_CLAIMED', 'This post is no longer available for claiming');
  }
  if (foundItem.authorId === claimantUserId) {
    throw new ClaimError(403, 'CANNOT_CLAIM_OWN_POST', 'You cannot claim an item you found');
  }

  const duplicate = await claimRepository.findPendingByClaimantAndPost(claimantUserId, foundItemPostId);
  if (duplicate) {
    throw new ClaimError(409, 'POST_ALREADY_CLAIMED', 'You already have a pending claim for this post');
  }

  const claim = await claimRepository.create({
    id: randomUUID(),
    status: 'PENDING',
    justification: request.justification.trim(),
    itemDetails: request.itemDetails.trim(),
    proofPhotoUrl: request.proofPhotoUrl,
    foundItemPostId,
    claimantUserId,
  });

  await notificationRepository.create({
    id: randomUUID(),
    userId: foundItem.authorId,
    message: `${claimant.name} has submitted a claim for your found item`,
    relatedPostId: foundItemPostId,
  });

  return toClaimResponse(claim);
};

const getClaims = async (query: ClaimListQuery, userId: string): Promise<ClaimsListResponse> => {
  const [items, count] = query.role === 'mine'
    ? await Promise.all([
        claimRepository.findMine(userId, query.status, query.page, query.limit),
        claimRepository.countMine(userId, query.status),
      ])
    : await Promise.all([
        claimRepository.findToReview(userId, query.status, query.page, query.limit),
        claimRepository.countToReview(userId, query.status),
      ]);

  return {
    items: items.map(toClaimResponse),
    page: query.page,
    limit: query.limit,
    total: count.total,
  };
};

const getClaimById = async (id: string, userId: string): Promise<ClaimDetailResponse> => {
  const claim = await claimRepository.findDetailById(id);
  if (!claim) {
    throw new ClaimError(404, 'CLAIM_NOT_FOUND', 'Claim not found');
  }

  if (claim.claimant.id !== userId && claim.foundItem?.authorId !== userId) {
    throw new ForbiddenError('You are not authorized to view this claim');
  }
  if (!claim.foundItem) {
    throw new NotFoundError('Found item post not found');
  }

  return {
    id: claim.id,
    status: claim.status as ClaimStatus,
    claimant: { id: claim.claimant.id },
    claim: {
      justification: claim.justification,
      itemDetails: claim.itemDetails,
      proofPhotoUrl: claim.proofPhotoUrl,
    },
    foundItem: {
      id: claim.foundItem.id,
      title: claim.foundItem.title,
      category: claim.foundItem.category,
      description: claim.foundItem.content,
      foundLocation: claim.foundItem.foundLocation,
      foundDate: claim.foundItem.foundDate,
      photoUrl: claim.foundItem.photoUrl,
    },
    createdAt: claim.createdAt,
    updatedAt: claim.updatedAt,
  };
};

const reviewClaim = async (id: string, decision: ReviewDecision, userId: string): Promise<ClaimResponse> => {
  const claim = await claimRepository.findById(id);
  if (!claim) {
    throw new ClaimError(404, 'CLAIM_NOT_FOUND', 'Claim not found');
  }

  const foundItem = await postRepository.findById(claim.foundItemPostId);
  if (!foundItem || foundItem.authorId !== userId) {
    throw new ForbiddenError('Only the finder can review this claim');
  }
  if (claim.status !== 'PENDING') {
    throw new ClaimError(409, 'CLAIM_ALREADY_REVIEWED', 'This claim has already been reviewed');
  }
  if (decision === 'approve' && foundItem.status !== 'OPEN') {
    throw new ClaimError(409, 'POST_ALREADY_CLAIMED', 'This post is no longer available for claiming');
  }

  const status: ClaimStatus = decision === 'approve' ? 'APPROVED' : 'REJECTED';
  const updatedClaim = await claimRepository.updateStatus(id, status);

  if (decision === 'approve') {
    await postRepository.update(claim.foundItemPostId, {
      status: 'CLAIMED',
      claimedById: claim.claimantUserId,
    });
  }

  await notificationRepository.create({
    id: randomUUID(),
    userId: claim.claimantUserId,
    message: decision === 'approve'
      ? 'Your claim has been approved! Please go to the Lost & Found office to collect your item.'
      : 'Your claim has been rejected. You may submit another claim or contact the finder.',
    relatedPostId: claim.foundItemPostId,
  });

  return toClaimResponse(updatedClaim ?? { ...claim, status });
};

export { getClaimById, getClaims, reviewClaim, submitClaim };