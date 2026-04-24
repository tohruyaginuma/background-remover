import { composeOnCanvas } from "@/lib/canvas";
import { type Settings } from "@/lib/types";

const mapStatusToMessage = (status: number): string => {
  const messages: Record<number, string> = {
    400: "Unsupported image format",
    401: "Invalid API key",
    402: "Usage limit reached",
    429: "Rate limited — please try again later",
    500: "API error",
  };
  return messages[status] ?? "API error";
};

export const processImage = async (
  file: File,
  settings: Settings,
  skipBgRemove = false,
): Promise<Blob> => {
  if (skipBgRemove) {
    return composeOnCanvas(file, settings);
  }

  const form = new FormData();
  form.append("image_file", file);

  const res = await fetch("/api/remove-bg", { method: "POST", body: form });
  if (!res.ok) {
    let message = mapStatusToMessage(res.status);
    try {
      const json = await res.json();
      if (json.error) message = json.error;
    } catch {
      // use default message
    }
    throw new Error(message);
  }

  const pngBlob = await res.blob();
  return composeOnCanvas(pngBlob, settings);
};
