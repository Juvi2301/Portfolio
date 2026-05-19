"use client";

import { useEffect } from "react";
import Script from "next/script";

type LiquidGLLens = {
  _shadowEl?: HTMLElement | null;
  _mirror?: HTMLCanvasElement | null;
  _rafId?: number | null;
};

type LiquidGLRenderer = {
  canvas?: HTMLCanvasElement | null;
  lenses?: LiquidGLLens[];
  _rafId?: number | null;
  useExternalTicker?: boolean;
};

type LiquidGLOptions = {
  snapshot?: string;
  target: string;
  resolution?: number;
  refraction?: number;
  bevelDepth?: number;
  bevelWidth?: number;
  frost?: number;
  magnify?: number;
  shadow?: boolean;
  specular?: boolean;
  tilt?: boolean;
  tiltFactor?: number;
  reveal?: "none" | "fade";
};

declare global {
  interface Window {
    liquidGL?: {
      (options: LiquidGLOptions): LiquidGLLens | LiquidGLLens[] | undefined;
      syncWith?: () => unknown;
    };
    __liquidGLRenderer__?: LiquidGLRenderer | null;
    __portfolioLiquidGLReady__?: boolean;
  }
}

const NAV_LIQUID_GL_OPTIONS: LiquidGLOptions = {
  snapshot: "body",
  target: ".nav-container",
  resolution: 2,
  refraction: 0,
  bevelDepth: 0.052,
  bevelWidth: 0.211,
  frost: 2,
  magnify: 1,
  shadow: true,
  specular: true,
  tilt: false,
  tiltFactor: 5,
  reveal: "fade",
};

function cleanupLiquidGL() {
  const renderer = window.__liquidGLRenderer__;

  if (!renderer) return;

  if (renderer._rafId) {
    cancelAnimationFrame(renderer._rafId);
  }

  renderer.lenses?.forEach((lens) => {
    if (lens._rafId) {
      cancelAnimationFrame(lens._rafId);
    }
    lens._shadowEl?.remove();
    lens._mirror?.remove();
  });

  renderer.canvas?.remove();
  window.__liquidGLRenderer__ = null;
  window.__portfolioLiquidGLReady__ = false;
}

export default function LiquidGLInitializer() {
  useEffect(() => {
    return cleanupLiquidGL;
  }, []);

  const handleInit = () => {
    if (typeof window === "undefined" || !window.liquidGL) return;

    if (window.__portfolioLiquidGLReady__) return;
    window.__portfolioLiquidGLReady__ = true;

    window.requestAnimationFrame(() => {
      cleanupLiquidGL();
      window.__portfolioLiquidGLReady__ = true;
      window.liquidGL?.(NAV_LIQUID_GL_OPTIONS);
    });
  };

  return (
    <>
      <Script
        id="html2canvas"
        src="/scripts/html2canvas.min.js"
        strategy="afterInteractive"
      />
      <Script
        id="liquid-gl"
        src="/scripts/liquidGL.js"
        strategy="afterInteractive"
        onReady={handleInit}
      />
    </>
  );
}
