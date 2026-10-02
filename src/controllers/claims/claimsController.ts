import type { NextFunction, Request, Response } from 'express';
import * as claimService from '@/services/claims/claims';
import type { ClaimRole, ClaimStatus, ReviewDecision } from '@/types/claim';
import { BadRequestError, AuthenticationError } from '@/utils/errors';

const currentUserId = (req: Request) => {
  if (!req.userId) {
    throw new AuthenticationError('Authentication required');
  }
  return req.userId;
};

const pathParam = (value: string | string[] | undefined, name: string) => {
  if (typeof value !== 'string' || value.length === 0) {
    throw new BadRequestError(`${name} is required`);
  }
  return value;
};

const parseStatus = (value: unknown): ClaimStatus | undefined => {
  if (value === undefined) return undefined;
  if (value !== 'PENDING' && value !== 'APPROVED' && value !== 'REJECTED') {
    throw new BadRequestError('status must be PENDING, APPROVED, or REJECTED');
  }
  return value;
};

const parsePositiveInt = (value: unknown, name: string, fallback: number, max?: number) => {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || (max !== undefined && parsed > max)) {
    throw new BadRequestError(`${name} is invalid`);
  }
  return parsed;
};

const submitClaim = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const foundItemPostId = pathParam(req.params.id, 'Found item post ID');
    const { justification, itemDetails, proofPhotoUrl } = req.body ?? {};
    if (typeof justification !== 'string' || !justification.trim()) {
      throw new BadRequestError('Justification is required');
    }
    if (typeof itemDetails !== 'string' || !itemDetails.trim()) {
      throw new BadRequestError('Item details are required');
    }
    if (proofPhotoUrl !== undefined && typeof proofPhotoUrl !== 'string') {
      throw new BadRequestError('proofPhotoUrl must be a URL');
    }
    if (proofPhotoUrl) {
      try {
        new URL(proofPhotoUrl);
      } catch {
        if (!proofPhotoUrl.startsWith('/uploads/')) {
          throw new BadRequestError('proofPhotoUrl must be a valid URL');
        }
      }
    }

    const claim = await claimService.submitClaim(
      foundItemPostId,
      { justification, itemDetails, proofPhotoUrl },
      currentUserId(req),
    );
    return res.status(201).location(`/api/v1/claims/${claim.id}`).json(claim);
  } catch (error) {
    return next(error);
  }
};

const getClaims = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = req.query.role;
    if (role !== 'mine' && role !== 'toReview') {
      throw new BadRequestError("role must be 'mine' or 'toReview'");
    }
    const result = await claimService.getClaims({
      role: role as ClaimRole,
      status: parseStatus(req.query.status),
      page: parsePositiveInt(req.query.page, 'page', 1),
      limit: parsePositiveInt(req.query.limit, 'limit', 20, 100),
    }, currentUserId(req));
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

const getClaimById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await claimService.getClaimById(pathParam(req.params.id, 'Claim ID'), currentUserId(req));
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

const reviewClaim = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const decision = req.body?.decision;
    if (decision !== 'approve' && decision !== 'reject') {
      throw new BadRequestError("decision must be 'approve' or 'reject'");
    }
    const result = await claimService.reviewClaim(
      pathParam(req.params.id, 'Claim ID'),
      decision as ReviewDecision,
      currentUserId(req),
    );
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

export { getClaimById, getClaims, reviewClaim, submitClaim };