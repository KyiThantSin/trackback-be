import { Router } from "express";
import * as uploadController from "@/controllers/media/mediaController";
import { secureRoute } from "@/middlewares/secure-route";
import upload from "@/middlewares/upload";

const router = Router();

router.post(
  "/image",
  secureRoute,
  upload.array("image"),
  uploadController.uploadImage,
);
router.delete("/image", secureRoute, uploadController.deleteImage);

export default router;
