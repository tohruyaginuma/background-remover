import JSZip from "jszip";
import { type ImageItem } from "@/lib/types";

const stripExt = (filename: string): string => filename.replace(/\.[^.]+$/, "");

const triggerDownload = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const resultExt = (blob: Blob) => (blob.type === "image/png" ? "png" : "jpg");

export const downloadAllAsZip = async (items: ImageItem[]): Promise<void> => {
  const zip = new JSZip();
  for (const item of items) {
    if (item.status === "done" && item.resultBlob) {
      const ext = resultExt(item.resultBlob);
      zip.file(`${stripExt(item.file.name)}_edited.${ext}`, item.resultBlob);
    }
  }
  const blob = await zip.generateAsync({ type: "blob" });
  triggerDownload(blob, "images_edited.zip");
};

export const downloadSingle = (blob: Blob, filename: string): void => {
  const ext = resultExt(blob);
  triggerDownload(blob, `${stripExt(filename)}_edited.${ext}`);
};
