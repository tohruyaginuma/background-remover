"use client";

import { useState } from "react";
import { changelog } from "@/lib/changelog";

export const ChangelogModal = ({ version }: { version: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="underline decoration-gray-300 underline-offset-2 hover:text-gray-600 hover:decoration-gray-400 transition-colors cursor-pointer"
      >
        {version}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg w-full max-w-sm mx-4 p-6 max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-gray-700">Changelog</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none"
              >
                ✕
              </button>
            </div>
            <div className="space-y-5">
              {changelog.map((entry) => (
                <div key={entry.version}>
                  <p className="text-xs font-mono font-semibold text-gray-400 mb-2">
                    v{entry.version}
                  </p>
                  <ul className="space-y-1.5">
                    {entry.changes.map((change, i) => (
                      <li key={i} className="flex gap-2 text-xs text-gray-600">
                        <span className="text-gray-300 shrink-0">—</span>
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
