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
  frost: 6,
  magnify: 1,
  shadow: true,
  specular: true,
  tilt: false,
  tiltFactor: 5,
  reveal: "fade",
};

const ICON_LIQUID_GL_OPTIONS: LiquidGLOptions = {
  ...NAV_LIQUID_GL_OPTIONS,
  target: ".icon-wrapper",
  bevelDepth: 0.06,
  bevelWidth: 0.18,
  frost: 1.4,
  reveal: "none",
};

const STAT_BADGE_LIQUID_GL_OPTIONS: LiquidGLOptions = {
  ...ICON_LIQUID_GL_OPTIONS,
  target: ".liquid-glass-badge-lens",
  bevelDepth: 0.06,
  bevelWidth: 0.18,
  frost: 1.4,
  shadow: true,
  specular: true,
};

const ABOUT_CARD_LIQUID_GL_OPTIONS: LiquidGLOptions = {
  ...NAV_LIQUID_GL_OPTIONS,
  target: ".about-card-lens",
  bevelDepth: 0.042,
  bevelWidth: 0.16,
  frost: 2.8,
  shadow: true,
  specular: true,
  reveal: "none",
};

const EXPERIENCE_CARD_LIQUID_GL_OPTIONS: LiquidGLOptions = {
  ...ABOUT_CARD_LIQUID_GL_OPTIONS,
  target: ".experience-card-lens",
  bevelDepth: 0.038,
  bevelWidth: 0.15,
  frost: 2.1,
};

const EXPERIENCE_NODE_LIQUID_GL_OPTIONS: LiquidGLOptions = {
  ...ICON_LIQUID_GL_OPTIONS,
  target: ".experience-node-lens",
  bevelDepth: 0.058,
  bevelWidth: 0.18,
  frost: 1.2,
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
      window.liquidGL?.(ICON_LIQUID_GL_OPTIONS);
      window.liquidGL?.(STAT_BADGE_LIQUID_GL_OPTIONS);
      window.liquidGL?.(ABOUT_CARD_LIQUID_GL_OPTIONS);
      window.liquidGL?.(EXPERIENCE_CARD_LIQUID_GL_OPTIONS);
      window.liquidGL?.(EXPERIENCE_NODE_LIQUID_GL_OPTIONS);
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
