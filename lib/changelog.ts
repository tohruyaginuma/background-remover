export type ChangelogEntry = {
  version: string;
  changes: string[];
};

export const changelog: ChangelogEntry[] = [
  {
    version: "28.04.2026",
    changes: [
      "Auto-trim output to the object's bounding box after background removal",
    ],
  },
  {
    version: "24.04.2026",
    changes: [
      "Background removal via remove.bg API",
      "Background color and transparency toggle",
      "Padding, canvas size, and compression level settings",
      "Drag-and-drop multi-image upload",
      "Bulk ZIP download",
    ],
  },
];
