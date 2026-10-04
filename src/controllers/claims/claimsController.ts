import type { NextFunction, Request, Response } from 'express';
import * as claimService from '@/services/claims/claims';
import * as cloudinaryService from '@/integrations/cloudinary/cloudinaryService';
import { CLOUDINARY_FOLDERS } from '@/integrations/cloudinary/cloudinaryFolders';
import type { ClaimRole, ClaimStatus, ReviewDecision } from '@/types/claim';
import { BadRequestError, AuthenticationError } from '@/errors/http-errors';

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
    const { justification, itemDetails } = req.body ?? {};
    const proofPhotoUrlField = req.body?.proofPhotoUrl;
    if (typeof justification !== 'string' || !justification.trim()) {
      throw new BadRequestError('Justification is required');
    }
    if (typeof itemDetails !== 'string' || !itemDetails.trim()) {
      throw new BadRequestError('Item details are required');
    }

    // A proofPhoto file wins over the proofPhotoUrl field.
    let proofPhotoUrl: string | undefined;
    if (req.file) {
      if (req.file.size === 0) {
        throw new BadRequestError('Proof photo file must not be empty');
      }
      const uploaded = await cloudinaryService.uploadImage(
        req.file.buffer,
        CLOUDINARY_FOLDERS.CLAIM_PROOF,
      );
      proofPhotoUrl = uploaded.url;
    } else if (proofPhotoUrlField !== undefined) {
      if (typeof proofPhotoUrlField !== 'string') {
        throw new BadRequestError('proofPhotoUrl must be a URL');
      }
      if (proofPhotoUrlField) {
        try {
          new URL(proofPhotoUrlField);
        } catch {
          if (!proofPhotoUrlField.startsWith('/uploads/')) {
            throw new BadRequestError('proofPhotoUrl must be a valid URL');
          }
        }
      }
      proofPhotoUrl = proofPhotoUrlField || undefined;
    }

    const claim = await claimService.submitClaim(
      foundItemPostId,
      { justification, itemDetails, proofPhotoUrl },
      currentUserId(req),
    );
    return res.status(201).location(`/claims/${claim.id}`).json(claim);
  } catch (error) {
    return next(error);
  }
};

const sendClaimInvite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const foundItemPostId = pathParam(req.params.id, 'Found item post ID');
    const { lostItemId } = req.body ?? {};
    if (typeof lostItemId !== 'string' || !lostItemId.trim()) {
      throw new BadRequestError('lostItemId is required');
    }

    await claimService.sendClaimInvite(foundItemPostId, lostItemId.trim(), currentUserId(req));
    return res.status(201).json({ message: 'Claim invite sent' });
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

export { getClaimById, getClaims, reviewClaim, sendClaimInvite, submitClaim };