import { FileCategory } from "../types/fileProcessingTypes.ts";

export function getFileCategory(
  mimeType: string,
  fileName: string
): FileCategory {
  if (!mimeType || !fileName) return "unknown";

  const type = mimeType.toLowerCase();

  // Handle ambiguous cases first
  if (fileName) {
    const ext = fileName.toLowerCase().split(".").pop();

    // TypeScript files are often misidentified as video/mp2t
    if (type === "video/mp2t" && (ext === "ts" || ext === "tsx")) {
      return "text";
    }

    // JavaScript files sometimes get weird MIME types
    if (
      (ext === "js" || ext === "jsx") &&
      !type.includes("javascript") &&
      !type.includes("text")
    ) {
      return "text";
    }

    // Other common text files that might be misidentified
    const textExtensions = [
      "md",
      "txt",
      "json",
      "xml",
      "yml",
      "yaml",
      "toml",
      "ini",
      "cfg",
      "conf",
    ];
    if (
      textExtensions.includes(ext || "") &&
      !type.startsWith("text/") &&
      !type.includes("json") &&
      !type.includes("xml")
    ) {
      return "text";
    }
  }

  // Images - only popular/safe formats
  const popularImageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "image/bmp",
    "image/tiff",
    "image/avif",
  ];

  if (popularImageTypes.includes(type)) {
    return "image";
  }

  // Videos - only popular/safe formats
  const popularVideoTypes = [
    "video/mp4",
    "video/mpeg",
    "video/quicktime", // .mov
    "video/x-msvideo", // .avi
    "video/webm",
    "video/x-ms-wmv", // .wmv
    "video/x-flv", // .flv
    "video/3gpp", // .3gp
    "video/x-matroska", // .mkv
  ];

  if (popularVideoTypes.includes(type)) {
    return "video";
  }

  // Audio
  if (type.startsWith("audio/")) {
    return "audio";
  }

  // Text files
  if (
    type.startsWith("text/") ||
    type === "application/json" ||
    type === "application/xml" ||
    type === "application/javascript" ||
    type === "application/typescript" ||
    type === "text/typescript" ||
    type === "application/x-typescript"
  ) {
    return "text";
  }

  // PDFs
  if (type === "application/pdf") {
    return "pdf";
  }

  // Documents
  if (
    type === "application/msword" ||
    type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    type === "application/vnd.ms-excel" ||
    type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    type === "application/vnd.ms-powerpoint" ||
    type ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
    type === "application/rtf" ||
    type === "application/vnd.oasis.opendocument.text" ||
    type === "application/vnd.oasis.opendocument.spreadsheet" ||
    type === "application/vnd.oasis.opendocument.presentation"
  ) {
    return "document";
  }

  // Archives
  if (
    type === "application/zip" ||
    type === "application/x-rar-compressed" ||
    type === "application/x-7z-compressed" ||
    type === "application/x-tar" ||
    type === "application/gzip" ||
    type === "application/x-bzip2"
  ) {
    return "archive";
  }

  // Executables
  if (
    type === "application/x-executable" ||
    type === "application/x-msdos-program" ||
    type === "application/x-msdownload" ||
    type === "application/vnd.microsoft.portable-executable"
  ) {
    return "executable";
  }

  // Fonts
  if (
    type.startsWith("font/") ||
    type === "application/font-woff" ||
    type === "application/font-woff2" ||
    type === "application/vnd.ms-fontobject"
  ) {
    return "font";
  }

  return "unknown";
}
