import { randomUUID } from 'node:crypto';
import * as claimRepository from '@/repositories/claimRepository';
import * as notificationService from '@/services/notifications/notifications';
import * as matchingService from '@/services/matching/matching';
import * as foundItemRepository from '@/repositories/foundItemRepository';
import * as lostItemRepository from '@/repositories/lostItemRepository';
import * as notificationRepository from '@/repositories/notificationRepository';
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
import { ClaimError, ForbiddenError, NotFoundError } from '@/errors/http-errors';

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

  const foundItem = await foundItemRepository.findFoundItemById(foundItemPostId);
  if (!foundItem) {
    throw new ClaimError(404, 'FOUND_POST_NOT_FOUND', 'Found item post not found');
  }
  if (foundItem.status !== 'OPEN') {
    throw new ClaimError(409, 'POST_ALREADY_CLAIMED', 'This post is no longer available for claiming');
  }
  if (foundItem.userId === claimantUserId) {
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

  await foundItemRepository.updateFoundItemStatus(foundItemPostId, 'PENDING_CLAIM');

  await notificationService.notifyUser(
    foundItem.userId,
    `${claimant.name} has submitted a claim for your found item`,
    foundItemPostId,
    claim.id,
  );

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

  if (claim.claimant.id !== userId && claim.foundItem?.userId !== userId) {
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
      description: claim.foundItem.description,
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

  const foundItem = await foundItemRepository.findFoundItemById(claim.foundItemPostId);
  if (!foundItem || foundItem.userId !== userId) {
    throw new ForbiddenError('Only the finder can review this claim');
  }
  if (claim.status !== 'PENDING') {
    throw new ClaimError(409, 'CLAIM_ALREADY_REVIEWED', 'This claim has already been reviewed');
  }
  if (decision === 'approve' && foundItem.status !== 'OPEN' && foundItem.status !== 'PENDING_CLAIM') {
    throw new ClaimError(409, 'POST_ALREADY_CLAIMED', 'This post is no longer available for claiming');
  }

  const status: ClaimStatus = decision === 'approve' ? 'APPROVED' : 'REJECTED';
  const updatedClaim = await claimRepository.updateStatus(id, status);

  await foundItemRepository.updateFoundItemStatus(
    claim.foundItemPostId,
    decision === 'approve' ? 'CLAIMED' : 'OPEN',
  );

  if (decision === 'approve') {
    // Auto-recover the claimant's open lost-item posts that match this found
    // item, so both sides of a successful match end up closed.
    const relatedLostItems = await matchingService.findUserMatchesForFoundItem(
      claim.foundItemPostId,
      claim.claimantUserId,
    );
    await Promise.all(relatedLostItems.map((lostItem) =>
      lostItemRepository.updateLostItemStatus(lostItem.id, 'RECOVERED'),
    ));
  }

  await notificationService.notifyUser(
    claim.claimantUserId,
    decision === 'approve'
      ? 'Your claim has been approved! Please go to the Lost & Found office to collect your item.'
      : 'Your claim has been rejected. You may submit another claim or contact the finder.',
    claim.foundItemPostId,
    id,
  );

  return toClaimResponse(updatedClaim ?? { ...claim, status });
};

const sendClaimInvite = async (
  foundItemPostId: string,
  lostItemId: string,
  finderUserId: string,
): Promise<void> => {
  const finder = await userRepository.findById(finderUserId);
  if (!finder) {
    throw new NotFoundError('User not found');
  }

  const foundItem = await foundItemRepository.findFoundItemById(foundItemPostId);
  if (!foundItem) {
    throw new ClaimError(404, 'FOUND_POST_NOT_FOUND', 'Found item post not found');
  }
  if (foundItem.userId !== finderUserId) {
    throw new ClaimError(403, 'NOT_FOUND_ITEM_OWNER', 'Only the finder of this item can send claim invites');
  }
  if (foundItem.status !== 'OPEN') {
    throw new ClaimError(409, 'POST_ALREADY_CLAIMED', 'This post is no longer available for claiming');
  }

  const lostItem = await lostItemRepository.findLostItemById(lostItemId);
  if (!lostItem) {
    throw new ClaimError(404, 'LOST_POST_NOT_FOUND', 'Lost item post not found');
  }
  if (lostItem.status !== 'OPEN') {
    throw new ClaimError(409, 'LOST_POST_NOT_OPEN', 'This lost item post is no longer open');
  }
  if (lostItem.userId === finderUserId) {
    throw new ClaimError(403, 'CANNOT_INVITE_OWN_LOST_POST', 'You cannot send a claim invite for your own lost item post');
  }

  const message = `${finder.name} believes they found your item "${lostItem.title}". Submit a claim for "${foundItem.title}" to confirm it's yours.`;
  const existingInvite = await notificationRepository
    .findUnreadByUserRelatedItemAndMessage(lostItem.userId, foundItemPostId, message);
  if (existingInvite) {
    throw new ClaimError(409, 'CLAIM_INVITE_ALREADY_SENT', 'You have already invited this user to claim this found item');
  }

  await notificationService.notifyUser(lostItem.userId, message, foundItemPostId);
};

export { getClaimById, getClaims, reviewClaim, sendClaimInvite, submitClaim };