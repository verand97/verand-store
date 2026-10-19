"use client";

/**
 * Premium ambient background:
 *  - High-end dark obsidian gradient
 *  - Subtle top ambient celestial radiance
 *  - Micro-grid accent with radial mask
 * No heavy CPU pointer listeners or jarring AI-slop neon blobs.
 */
export default function BackgroundFX() {
  return (
    <div className="bg-fx" aria-hidden="true">
      <div className="bg-ambient-top" />
      <div className="bg-ambient-glow" />
      <div className="bg-subtle-pattern" />
    </div>
  );
}
