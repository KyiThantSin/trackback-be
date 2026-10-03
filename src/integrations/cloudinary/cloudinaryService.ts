import cloudinary, {
  cloudinaryRootFolder,
} from "@/integrations/cloudinary/client";
import type { CloudinaryFolder } from "@/integrations/cloudinary/cloudinaryFolders";

export interface UploadedImage {
  url: string;
  publicId: string;
}

const uploadImage = (
  file: Buffer,
  folder: CloudinaryFolder,
): Promise<UploadedImage> =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `${cloudinaryRootFolder}/${folder}`,
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result)
            return reject(error ?? new Error("Upload failed"));
          resolve({ url: result.secure_url, publicId: result.public_id });
        },
      )
      .end(file);
  });

const uploadImages = async (
  files: Buffer[],
  folder: CloudinaryFolder,
): Promise<UploadedImage[]> =>
  Promise.all(files.map((file) => uploadImage(file, folder)));

const deleteImages = (publicIds: string[]): Promise<void> =>
  new Promise((resolve, reject) => {
    if (publicIds.length === 0) {
      return resolve();
    }

    cloudinary.api.delete_resources(
      publicIds,
      { resource_type: "image", type: "upload", invalidate: true },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        if (!result || !result.deleted) {
          return reject(new Error("Image deletion failed"));
        }

        resolve();
      },
    );
  });

const deleteImage = (publicId: string): Promise<void> =>
  deleteImages([publicId]);

export { deleteImage, deleteImages, uploadImage, uploadImages };
