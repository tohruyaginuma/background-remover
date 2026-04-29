"use client";

import { useRef, useState } from "react";

type DropZoneProps = {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
};

export const DropZone = ({ onFiles, disabled = false }: DropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const accepted = Array.from(files).filter((f) =>
      ["image/jpeg", "image/png", "image/webp"].includes(f.type),
    );
    if (accepted.length > 0) onFiles(accepted);
  };

  const baseClass = "border-2 border-dashed rounded-xl p-10 text-center transition-colors min-h-64 flex flex-col items-center justify-center";
  const stateClass = disabled
    ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-50"
    : isDragging
      ? "border-blue-500 bg-blue-50 cursor-pointer"
      : "border-gray-300 hover:border-gray-400 bg-gray-50 cursor-pointer";

  return (
    <div
      className={`${baseClass} ${stateClass}`}
      onClick={() => { if (!disabled) inputRef.current?.click(); }}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (!disabled) handleFiles(e.dataTransfer.files);
      }}
    >
      <p className="text-gray-500 text-sm">
        Drop files here, or
        <span className="text-blue-600 font-medium ml-1">click to select</span>
      </p>
      <p className="text-gray-400 text-xs mt-1">JPG / PNG / WebP — max 25 MB per image</p>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={disabled}
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
};
