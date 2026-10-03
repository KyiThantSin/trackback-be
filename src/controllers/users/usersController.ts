import { BadRequestError } from "@/errors/http-errors";
import { type NextFunction, type Request, type Response } from "express";
import * as userService from "@/services/users/users";

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;

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
    const userId = req.params.id;
    const { name, email, password } = req.body;

    if (typeof userId !== "string" || userId.length === 0) {
      throw new BadRequestError("User ID is required");
    }

    if (name === undefined && email === undefined && password === undefined) {
      throw new BadRequestError("At least one valid user field is required");
    }

    const response = await userService.updateUser(userId, {
      name: name,
      email: email?.trim(),
      password,
    });

    return res.status(200).json({ response, message: "Update Successfully" });
  } catch (error) {
    return next(error);
  }
};

export { getUser, updateUser };
