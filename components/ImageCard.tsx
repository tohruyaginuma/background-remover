"use client";

import Image from "next/image";
import { type ImageItem } from "@/lib/types";

type ImageCardProps = {
  item: ImageItem;
  onProcess: (id: string) => void;
  onDownload: (id: string) => void;
  onRemove: (id: string) => void;
  onToggleSkip: (id: string) => void;
};

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  idle: { label: "Idle", className: "bg-gray-100 text-gray-500" },
  processing: { label: "Processing", className: "bg-blue-100 text-blue-600" },
  done: { label: "Done", className: "bg-green-100 text-green-600" },
  error: { label: "Error", className: "bg-red-100 text-red-600" },
};

const truncate = (str: string, max = 20) =>
  str.length > max ? str.slice(0, max) + "…" : str;

export const ImageCard = ({ item, onProcess, onDownload, onRemove, onToggleSkip }: ImageCardProps) => {
  const badge = STATUS_BADGE[item.status];
  const previewSrc = item.resultUrl ?? item.previewUrl;
  const canToggleSkip = item.status === "idle" || item.status === "error";

  return (
    <div className="relative border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col">
      <button
        onClick={() => onRemove(item.id)}
        className="absolute top-1.5 right-1.5 z-10 p-1 text-gray-400 hover:text-gray-600 bg-white/80 hover:bg-white rounded-full transition-colors"
        aria-label="Remove"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
      <div
        className="relative w-full aspect-square"
        style={
          item.status === "done"
            ? {
                backgroundImage:
                  "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
                backgroundSize: "16px 16px",
                backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
              }
            : { backgroundColor: "#f3f4f6" }
        }
      >
        <Image
          src={previewSrc}
          alt={item.file.name}
          fill
          className="object-contain"
          unoptimized
        />
        {item.status === "processing" && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <svg
              className="animate-spin h-8 w-8 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-gray-600 truncate flex-1" title={item.file.name}>
            {truncate(item.file.name)}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${badge.className}`}>
            {badge.label}
          </span>
        </div>

        {/* Remove background toggle */}
        <label className={`flex items-center gap-1.5 cursor-pointer ${canToggleSkip ? "" : "opacity-40 pointer-events-none"}`}>
          <input
            type="checkbox"
            checked={!item.skipBgRemove}
            onChange={() => onToggleSkip(item.id)}
            className="rounded"
          />
          <span className="text-xs text-gray-500">Remove background</span>
        </label>

        {item.status === "error" && item.error && (
          <p className="text-xs text-red-500">{item.error}</p>
        )}

        <div className="flex gap-2 mt-auto">
          {item.status === "error" && (
            <button
              onClick={() => onProcess(item.id)}
              className="flex-1 text-xs bg-blue-600 text-white rounded-lg py-1.5 hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          )}
          {item.status === "done" && (
            <button
              onClick={() => onDownload(item.id)}
              className="flex-1 text-xs bg-green-600 text-white rounded-lg py-1.5 hover:bg-green-700 transition-colors"
            >
              Download
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
