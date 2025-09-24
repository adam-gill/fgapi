export type FileCategory =
  | "image"
  | "video"
  | "audio"
  | "pdf"
  | "document"
  | "text"
  | "archive"
  | "executable"
  | "font"
  | "unknown";

export const supportedFileTypes = {
  images: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "image/bmp",
    "image/tiff",
    "image/tif",
    "image/avif",
    "image/heic",
    "image/heif",
  ],
};
