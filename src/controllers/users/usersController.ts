import { AuthenticationError, BadRequestError } from "@/errors/http-errors";
import { type NextFunction, type Request, type Response } from "express";
import * as userService from "@/services/users/users";

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id ?? req.userId;

    if (typeof userId !== "string" || userId.length === 0) {
      throw new BadRequestError("User ID is required");
    }

    const response = await userService.getUser(userId);
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      throw new AuthenticationError("Authentication required");
    }

    if (
      req.body.name === undefined &&
      req.body.email === undefined &&
      req.body.password === undefined &&
      req.body.about === undefined &&
      !req.file
    ) {
      throw new BadRequestError("At least one valid user field is required");
    }

    const response = await userService.updateUser(req.userId, {
      name: req.body.name,
      email: req.body.email?.trim(),
      password: req.body.password,
      about: req.body.about !== undefined ? req.body.about?.trim() : undefined,
      profileUrl: req.file?.buffer,
    });

    return res.status(200).json({ response, message: "Update Successfully" });
  } catch (error) {
    return next(error);
  }
};

export { getUser, updateUser };
