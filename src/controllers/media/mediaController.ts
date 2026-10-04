import { type NextFunction, type Request, type Response } from "express";
import { BadRequestError } from "@/errors/http-errors";
import * as cloudinaryService from "@/integrations/cloudinary/cloudinaryService";
import { CLOUDINARY_FOLDERS } from "@/integrations/cloudinary/cloudinaryFolders";

const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = Array.isArray(req.files) ? req.files : [];
    if (files.length === 0) {
      throw new BadRequestError("Image is required");
    }

    const images = await cloudinaryService.uploadImages(
      files.map((file) => file.buffer),
      CLOUDINARY_FOLDERS.LOST_ITEM,
    );

    return res.status(201).json({ data: images });
  } catch (error) {
    return next(error);
  }
};

const deleteImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const publicIds = Array.isArray(req.body?.publicIds)
      ? req.body.publicIds
      : [req.body?.publicId];

    if (
      publicIds.length === 0 ||
      publicIds.some((publicId: unknown) => typeof publicId !== "string" || publicId.trim().length === 0)
    ) {
      throw new BadRequestError("publicId or publicIds is required");
    }

    await cloudinaryService.deleteImages(
      publicIds.map((publicId: string) => publicId.trim()),
    );

    return res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

export { deleteImage, uploadImage };