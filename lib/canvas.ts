import { QUALITY_MAP, type Settings } from "@/lib/types";

const blobToImage = (blob: Blob): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });

const fitInto = (
  srcW: number,
  srcH: number,
  maxW: number,
  maxH: number,
): { dw: number; dh: number } => {
  const ratio = Math.min(maxW / srcW, maxH / srcH);
  return { dw: Math.round(srcW * ratio), dh: Math.round(srcH * ratio) };
};

const canvasToBlob = (
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number,
): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to convert canvas to blob"));
      },
      type,
      quality,
    );
  });

export const composeOnCanvas = async (
  transparentPngBlob: Blob,
  settings: Settings,
): Promise<Blob> => {
  const img = await blobToImage(transparentPngBlob);
  const canvas = document.createElement("canvas");
  canvas.width = settings.canvasWidth;
  canvas.height = settings.canvasHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  if (!settings.bgTransparent) {
    ctx.fillStyle = settings.bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const effectiveW = settings.canvasWidth - settings.padding * 2;
  const effectiveH = settings.canvasHeight - settings.padding * 2;
  const { dw, dh } = fitInto(img.width, img.height, effectiveW, effectiveH);
  const dx = (settings.canvasWidth - dw) / 2;
  const dy = (settings.canvasHeight - dh) / 2;

  ctx.drawImage(img, dx, dy, dw, dh);

  const { mimeType, quality } = QUALITY_MAP[settings.compression];
  return canvasToBlob(canvas, mimeType, quality);
};
