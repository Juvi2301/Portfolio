"use client";

import { useEffect } from "react";

// Cursor light on `.spotlight` tiles. One passive pointermove listener for the
// whole page, at most one style write per frame. Skipped on touch screens and
// under reduced motion, where the tiles keep their static glass.
export default function SpotlightEffect() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let lastEvent: PointerEvent | null = null;

    function paint() {
      frame = 0;
      if (!lastEvent || !(lastEvent.target instanceof Element)) return;
      const tile = lastEvent.target.closest<HTMLElement>(".spotlight");
      if (!tile) return;
      const rect = tile.getBoundingClientRect();
      tile.style.setProperty("--mx", `${lastEvent.clientX - rect.left}px`);
      tile.style.setProperty("--my", `${lastEvent.clientY - rect.top}px`);
    }

    function onPointerMove(event: PointerEvent) {
      lastEvent = event;
      if (!frame) frame = requestAnimationFrame(paint);
    }

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
