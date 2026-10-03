import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

if (!process.env.CLOUDINARY_URL) {
  throw new Error("CLOUDINARY_URL must be configured");
}

cloudinary.config(true);

export const cloudinaryRootFolder =
  process.env.CLOUDINARY_ROOT_FOLDER || "trackback-dev";

export default cloudinary;
