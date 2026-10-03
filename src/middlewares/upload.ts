import multer from "multer";
import { BadRequestError } from "@/errors/http-errors";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per image

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: MAX_IMAGES,
        fields: 20,
    },
    fileFilter: (_req, file, cb) => {
        if (!ALLOWED_TYPES.includes(file.mimetype)) {
            return cb(new BadRequestError("Only JPEG, PNG, and WebP images are allowed"));
        }
        cb(null, true);
    }
});

export default upload;