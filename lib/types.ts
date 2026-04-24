export type CompressionLevel = "lossless" | "soft" | "medium" | "hard";

export type Settings = {
  bgColor: string;
  bgTransparent: boolean;
  canvasWidth: number;
  canvasHeight: number;
  padding: number;
  compression: CompressionLevel;
};

export type ImageStatus = "idle" | "processing" | "done" | "error";

export type ImageItem = {
  id: string;
  file: File;
  previewUrl: string;
  status: ImageStatus;
  skipBgRemove: boolean;
  resultBlob?: Blob;
  resultUrl?: string;
  error?: string;
};

export type QualitySpec = { mimeType: string; quality?: number };

export const QUALITY_MAP: Record<CompressionLevel, QualitySpec> = {
  lossless: { mimeType: "image/jpeg", quality: 1.0 },
  soft:     { mimeType: "image/jpeg", quality: 0.9 },
  medium:   { mimeType: "image/jpeg", quality: 0.8 },
  hard:     { mimeType: "image/jpeg", quality: 0.7 },
};

export const DEFAULT_SETTINGS: Settings = {
  bgColor: "#ffffff",
  bgTransparent: false,
  canvasWidth: 1800,
  canvasHeight: 1800,
  padding: 140,
  compression: "soft",
};
