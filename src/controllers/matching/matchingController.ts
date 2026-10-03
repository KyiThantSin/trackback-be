import type { NextFunction, Request, Response } from 'express';
import * as matchingService from '@/services/matching/matching';
import { AuthenticationError, BadRequestError } from '@/errors/http-errors';

const currentUserId = (req: Request) => {
  if (!req.userId) throw new AuthenticationError('Authentication required');
  return req.userId;
};

const pathParam = (value: string | string[] | undefined, name: string) => {
  if (typeof value !== 'string' || value.length === 0) throw new BadRequestError(`${name} is required`);
  return value;
};

const getLostItemMatches = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(200).json(await matchingService.getLostItemMatches(
      pathParam(req.params.id, 'Lost item ID'),
      currentUserId(req),
    ));
  } catch (error) {
    return next(error);
  }
};

const getFoundItemMatches = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(200).json(await matchingService.getFoundItemMatches(
      pathParam(req.params.id, 'Found item ID'),
      currentUserId(req),
    ));
  } catch (error) {
    return next(error);
  }
};

const runMatching = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(200).json(await matchingService.runMatching(
      pathParam(req.params.postId, 'Post ID'),
      currentUserId(req),
    ));
  } catch (error) {
    return next(error);
  }
};

export { getFoundItemMatches, getLostItemMatches, runMatching };