export const CLOUDINARY_FOLDERS = {
  USER_PROFILE: "users/profile",
  LOST_ITEM: "lost-items/images",
  CLAIM_PROOF: "claims/proof",
} as const;

export type CloudinaryFolder =
  (typeof CLOUDINARY_FOLDERS)[keyof typeof CLOUDINARY_FOLDERS];