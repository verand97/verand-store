"use client";

import { useEffect, useRef } from "react";

/**
 * Layered animated background:
 *  - two drifting aurora blobs (purple + lime)
 *  - a subtle moving grid
 *  - an SVG grain/noise overlay
 *  - a cursor-following glow
 * All purely decorative and pointer-events:none.
 */
export default function BackgroundFX() {
  const glowRef = useRef(null);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;
    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx;
    let y = ty;

    function onMove(e) {
      tx = e.clientX;
      ty = e.clientY;
    }
    function loop() {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.transform = `translate(${x}px, ${y}px)`;
      raf = requestAnimationFrame(loop);
    }
    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="bg-fx" aria-hidden="true">
      <div className="bg-grid" />
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="bg-blob bg-blob-3" />
      <div ref={glowRef} className="bg-cursor-glow" />
      <div className="bg-grain" />
    </div>
  );
}
