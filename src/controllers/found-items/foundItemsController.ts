import jwt from 'jsonwebtoken';
import { BadRequestError, AuthenticationError } from '@/errors/http-errors';
import { type NextFunction, type Request, type Response } from 'express';
import * as foundItemService from '@/services/found-items/foundItems';

const createFoundItem = async (req: Request, res: Response, next: NextFunction) => {
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

    const {
      title,
      description,
      category,
      foundLocation,
      foundDate,
      photoUrl,
    } = req.body ?? {};

    if (
      typeof title !== 'string' || title.trim().length === 0 ||
      typeof description !== 'string' || description.trim().length === 0 ||
      typeof category !== 'string' || category.trim().length === 0 ||
      typeof foundLocation !== 'string' || foundLocation.trim().length === 0 ||
      typeof foundDate !== 'string' || foundDate.trim().length === 0
    ) {
      throw new BadRequestError(
        'Title, description, category, found location, and found date are required',
      );
    }

    if (Number.isNaN(Date.parse(foundDate))) {
      throw new BadRequestError('foundDate must be a valid date');
    }
    if (
      photoUrl !== undefined && photoUrl !== null &&
      (typeof photoUrl !== 'string' || photoUrl.trim().length === 0)
    ) {
      throw new BadRequestError('photoUrl must be a non-empty string or null');
    }

    const response = await foundItemService.createFoundItem({
      title,
      description,
      category,
      foundLocation,
      foundDate: new Date(foundDate).toISOString(),
      photoUrl,
      userId: payload.userId,
    });

    return res.status(201).json({
      data: response,
      message: 'Found item reported successfully',
    });
  } catch (error) {
    return next(error);
  }
};

export { createFoundItem };