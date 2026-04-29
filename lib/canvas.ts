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

type BoundingBox = { x: number; y: number; w: number; h: number };

const getObjectBounds = (img: HTMLImageElement): BoundingBox => {
  const tmpCanvas = document.createElement("canvas");
  tmpCanvas.width = img.width;
  tmpCanvas.height = img.height;
  const ctx = tmpCanvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");
  ctx.drawImage(img, 0, 0);

  const { data } = ctx.getImageData(0, 0, img.width, img.height);
  let minX = img.width, minY = img.height, maxX = -1, maxY = -1;

  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      if (data[(y * img.width + x) * 4 + 3] > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX === -1) return { x: 0, y: 0, w: img.width, h: img.height };
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
};

export const composeOnCanvas = async (
  transparentPngBlob: Blob,
  settings: Settings,
): Promise<Blob> => {
  const img = await blobToImage(transparentPngBlob);
  const { x, y, w, h } = getObjectBounds(img);

  const canvas = document.createElement("canvas");
  canvas.width = settings.canvasSize;
  canvas.height = settings.canvasSize;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  if (!settings.bgTransparent) {
    ctx.fillStyle = settings.bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Scale so the longer side fills canvasSize - padding * 2
  const effective = settings.canvasSize - settings.padding * 2;
  const ratio = effective / Math.max(w, h);
  const dw = Math.round(w * ratio);
  const dh = Math.round(h * ratio);
  const dx = (settings.canvasSize - dw) / 2;
  const dy = (settings.canvasSize - dh) / 2;

  ctx.drawImage(img, x, y, w, h, dx, dy, dw, dh);

  const { mimeType, quality } = QUALITY_MAP[settings.compression];
  return canvasToBlob(canvas, mimeType, quality);
};
