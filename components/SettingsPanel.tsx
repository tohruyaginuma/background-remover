"use client";

import { useState } from "react";
import { type CompressionLevel, type Settings } from "@/lib/types";

type SettingsPanelProps = {
  settings: Settings;
  onChange: (settings: Settings) => void;
};

const COMPRESSION_OPTIONS: { label: string; value: CompressionLevel }[] = [
  { label: "Maximum (JPG 100%)", value: "max" },
  { label: "Soft (90%)", value: "soft" },
  { label: "Medium (80%)", value: "medium" },
];

export const SettingsPanel = ({ settings, onChange }: SettingsPanelProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const update = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    onChange({ ...settings, [key]: value });

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <button
        type="button"
        onClick={() => setShowAdvanced((v) => !v)}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg
          className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? "rotate-90" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        Advanced settings
      </button>

      {showAdvanced && (
        <div className="mt-4 space-y-4">
          {/* Background color */}
          <div className="flex items-center gap-3">
            <label className="w-36 text-sm text-gray-600 shrink-0">Background</label>
            <input
              type="color"
              value={settings.bgColor}
              disabled={settings.bgTransparent}
              onChange={(e) => update("bgColor", e.target.value)}
              className="w-9 h-9 rounded cursor-pointer border border-gray-300 disabled:opacity-40"
            />
            <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.bgTransparent}
                onChange={(e) => update("bgTransparent", e.target.checked)}
                className="rounded"
              />
              Transparent
            </label>
            {!settings.bgTransparent && (
              <span className="text-xs text-gray-400 font-mono">{settings.bgColor}</span>
            )}
          </div>

          {/* Canvas size */}
          <div className="flex items-center gap-3">
            <label className="w-36 text-sm text-gray-600 shrink-0">Canvas size</label>
            <input
              type="number"
              min={100}
              max={8000}
              value={settings.canvasWidth}
              onChange={(e) => update("canvasWidth", Number(e.target.value))}
              className="w-20 border border-gray-300 rounded px-2 py-1 text-sm text-center"
            />
            <span className="text-gray-400">×</span>
            <input
              type="number"
              min={100}
              max={8000}
              value={settings.canvasHeight}
              onChange={(e) => update("canvasHeight", Number(e.target.value))}
              className="w-20 border border-gray-300 rounded px-2 py-1 text-sm text-center"
            />
            <span className="text-xs text-gray-400">px</span>
          </div>

          {/* Padding */}
          <div className="flex items-center gap-3">
            <label className="w-36 text-sm text-gray-600 shrink-0">Padding</label>
            <input
              type="number"
              min={0}
              max={500}
              value={settings.padding}
              onChange={(e) => update("padding", Number(e.target.value))}
              className="w-20 border border-gray-300 rounded px-2 py-1 text-sm text-center"
            />
            <span className="text-xs text-gray-400">px</span>
          </div>

          {/* Compression rate */}
          <div className="flex items-center gap-3">
            <label className="w-36 text-sm text-gray-600 shrink-0">Compression rate</label>
            <div className="flex gap-4 flex-wrap">
              {COMPRESSION_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="radio"
                    name="compression"
                    value={opt.value}
                    checked={settings.compression === opt.value}
                    onChange={() => update("compression", opt.value)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
