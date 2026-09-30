import jwt from 'jsonwebtoken';
import { BadRequestError, AuthenticationError } from '@/utils/errors';
import { type NextFunction, type Request, type Response } from 'express';
import * as lostItemService from '@/services/lost-items/lostItems';

const createLostItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;
    const accessSecret = process.env.ACCESS_TOKEN_SECRET;

    if (!token) {
      throw new AuthenticationError('Authentication required');
    }

    if (!accessSecret) {
      throw new Error('ACCESS_TOKEN_SECRET is not configured');
    }

    const payload = jwt.verify(token, accessSecret);

    if (
      typeof payload !== 'object' ||
      typeof payload.userId !== 'string' ||
      payload.userId.length === 0
    ) {
      throw new AuthenticationError('Invalid access token');
    }

    const { title, description, category, lastSeenLocation, lastSeenDate, photoUrl } = req.body;

    if (
      typeof title !== 'string' || title.trim().length === 0 ||
      typeof description !== 'string' || description.trim().length === 0 ||
      typeof category !== 'string' || category.trim().length === 0 ||
      typeof lastSeenLocation !== 'string' || lastSeenLocation.trim().length === 0 ||
      typeof lastSeenDate !== 'string' || lastSeenDate.trim().length === 0
    ) {
      throw new BadRequestError('Title, description, category, last seen location, and last seen date are required');
    }

    const response = await lostItemService.createLostItem({
      title,
      description,
      category,
      lastSeenLocation,
      lastSeenDate,
      photoUrl,
      userId: payload.userId,
    });

    return res.status(201).json({
      data: response,
      message: 'Lost item reported successfully',
    });
  } catch (error) {
    return next(error);
  }
};

export { createLostItem };
