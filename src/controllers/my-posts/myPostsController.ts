import type { NextFunction, Request, Response } from 'express';
import { AuthenticationError, BadRequestError } from '@/errors/http-errors';
import * as myPostsService from '@/services/my-posts/myPosts';

const parsePositiveInteger = (value: unknown, name: string, fallback: number, max?: number) => {
  if (value === undefined) return fallback;
  if (typeof value !== 'string') {
    throw new BadRequestError(`${name} must be a positive integer`);
  }

  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1 || (max !== undefined && parsed > max)) {
    throw new BadRequestError(`${name} must be a positive integer`);
  }
  return parsed;
};

const getMyPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      throw new AuthenticationError('Authentication required');
    }

    const page = parsePositiveInteger(req.query.page, 'page', 1);
    const limit = parsePositiveInteger(req.query.limit, 'limit', 10, 100);
    if (!Number.isSafeInteger(page * limit)) {
      throw new BadRequestError('page and limit are out of range');
    }

    const result = await myPostsService.listMyPosts(req.userId, page, limit);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

export { getMyPosts };
