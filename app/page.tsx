"use client";

import { useState, useCallback, useRef } from "react";
import { DropZone } from "@/components/DropZone";
import { SettingsPanel } from "@/components/SettingsPanel";
import { ImageCard } from "@/components/ImageCard";
import { processImage } from "@/lib/processImage";
import { downloadAllAsZip, downloadSingle } from "@/lib/zip";
import { DEFAULT_SETTINGS, type ImageItem, type Settings } from "@/lib/types";

const HomePage = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [items, setItems] = useState<ImageItem[]>([]);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const updateItem = useCallback(
    (id: string, patch: Partial<ImageItem>) =>
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item))),
    [],
  );

  const runProcess = useCallback(
    async (id: string, file: File, skipBgRemove: boolean) => {
      updateItem(id, { status: "processing", error: undefined });
      try {
        const blob = await processImage(file, settingsRef.current, skipBgRemove);
        const resultUrl = URL.createObjectURL(blob);
        updateItem(id, { status: "done", resultBlob: blob, resultUrl });
      } catch (err) {
        updateItem(id, {
          status: "error",
          error: err instanceof Error ? err.message : "An unknown error occurred",
        });
      }
    },
    [updateItem],
  );

  const handleFiles = useCallback((files: File[]) => {
    const newItems: ImageItem[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      status: "idle",
      skipBgRemove: false,
    }));
    setItems((prev) => [...prev, ...newItems]);
  }, []);

  const handleToggleSkip = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, skipBgRemove: !item.skipBgRemove } : item,
      ),
    );
  }, []);

  const handleStart = useCallback(
    async (currentItems: ImageItem[]) => {
      const targets = currentItems.filter((i) => i.status === "idle" || i.status === "error");
      for (const item of targets) {
        await runProcess(item.id, item.file, item.skipBgRemove);
      }
    },
    [runProcess],
  );

  const handleRetry = useCallback(
    (id: string) => {
      const item = items.find((i) => i.id === id);
      if (item) runProcess(id, item.file, item.skipBgRemove);
    },
    [items, runProcess],
  );

  const handleDownload = useCallback(
    (id: string) => {
      const item = items.find((i) => i.id === id);
      if (item?.resultBlob) downloadSingle(item.resultBlob, item.file.name);
    },
    [items],
  );

  const handleRemove = useCallback((id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
      if (item?.resultUrl) URL.revokeObjectURL(item.resultUrl);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const doneCount = items.filter((i) => i.status === "done").length;
  const processingCount = items.filter((i) => i.status === "processing").length;
  const idleCount = items.filter((i) => i.status === "idle").length;
  const pendingCount = items.filter((i) => i.status === "idle" || i.status === "error").length;
  const zipReady = doneCount > 0 && pendingCount === 0 && processingCount === 0;
  const isProcessing = processingCount > 0;

  return (
    <main className="flex-1 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Thumbnail Generator</h1>
          <p className="text-sm text-gray-400 mt-1">Create thumbnail images with automatic background removal.</p>
        </div>

        <DropZone onFiles={handleFiles} />

        {items.length > 0 && (
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <span className="text-sm text-gray-600">
              {items.length} image{items.length !== 1 ? "s" : ""}
              {isProcessing && <span className="ml-2 text-blue-600">({processingCount} processing…)</span>}
              {doneCount > 0 && !isProcessing && <span className="ml-2 text-green-600">({doneCount} done)</span>}
            </span>
            <div className="flex gap-3">
              {idleCount > 0 && (
                <button
                  onClick={() => handleStart(items)}
                  disabled={isProcessing}
                  className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg font-medium transition-colors enabled:hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Start
                </button>
              )}
              {doneCount > 0 && (
                <button
                  onClick={() => downloadAllAsZip(items)}
                  disabled={!zipReady}
                  className="px-5 py-2 bg-green-600 text-white text-sm rounded-lg font-medium transition-colors enabled:hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Download ZIP ({doneCount})
                </button>
              )}
            </div>
          </div>
        )}

        {items.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((item) => (
              <ImageCard
                key={item.id}
                item={item}
                onProcess={handleRetry}
                onDownload={handleDownload}
                onRemove={handleRemove}
                onToggleSkip={handleToggleSkip}
              />
            ))}
          </div>
        )}

        <SettingsPanel settings={settings} onChange={setSettings} />
      </div>
    </main>
  );
};

export default HomePage;
