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

function isMobileViewport() {
  return typeof window !== "undefined" && window.innerWidth < 768;
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

const TECHNICAL_SKILL_CARD_LIQUID_GL_OPTIONS: LiquidGLOptions = {
  ...ABOUT_CARD_LIQUID_GL_OPTIONS,
  target: ".technical-skill-card-lens",
  bevelDepth: 0.034,
  bevelWidth: 0.13,
  frost: 2,
};

const PROJECT_CARD_LIQUID_GL_OPTIONS: LiquidGLOptions = {
  ...ABOUT_CARD_LIQUID_GL_OPTIONS,
  target: ".project-card-lens",
  bevelDepth: 0.04,
  bevelWidth: 0.15,
  frost: 2.4,
  shadow: false,
  specular: true,
  reveal: "none",
};

const CONTACT_FOOTER_LIQUID_GL_OPTIONS: LiquidGLOptions = {
  ...ABOUT_CARD_LIQUID_GL_OPTIONS,
  target: ".contact-footer-lens",
  refraction: 0.008,
  bevelDepth: 0.04,
  bevelWidth: 0.16,
  frost: 2.4,
};

const CONTACT_FORM_LIQUID_GL_OPTIONS: LiquidGLOptions = {
  ...ABOUT_CARD_LIQUID_GL_OPTIONS,
  target: ".contact-form-lens",
  bevelDepth: 0.04,
  bevelWidth: 0.15,
  frost: 2.4,
  shadow: false,
  specular: true,
  reveal: "none",
};

const CONTACT_SEND_BTN_LIQUID_GL_OPTIONS: LiquidGLOptions = {
  ...ICON_LIQUID_GL_OPTIONS,
  target: ".contact-send-btn-lens",
  refraction: 0.008,
  bevelDepth: 0.045,
  bevelWidth: 0.16,
  frost: 1.5,
  shadow: true,
  specular: true,
};

const CONTACT_CONTROL_LIQUID_GL_OPTIONS: LiquidGLOptions = {
  ...ICON_LIQUID_GL_OPTIONS,
  target: ".contact-footer-cta-lens, .contact-footer-top-lens, .contact-footer-social-lens",
  refraction: 0.008,
  bevelDepth: 0.045,
  bevelWidth: 0.16,
  frost: 1.5,
  shadow: true,
  specular: true,
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

function buildMobileOptions(opts: LiquidGLOptions): LiquidGLOptions {
  return {
    ...opts,
    resolution: 1,
    shadow: false,
    // Zero out refraction on mobile — the canvas snapshot can be offset when
    // the mobile browser resizes (address bar), causing distorted backgrounds
    refraction: 0,
    // Scale down bevel values so the reflection ring isn't oversized on small elements
    bevelDepth: opts.bevelDepth != null ? opts.bevelDepth * 0.65 : opts.bevelDepth,
    bevelWidth: opts.bevelWidth != null ? opts.bevelWidth * 0.75 : opts.bevelWidth,
  };
}

function initAllLenses() {
  if (!window.liquidGL) return;
  cleanupLiquidGL();
  window.__portfolioLiquidGLReady__ = true;
  const mobile = isMobileViewport();
  const opt = mobile ? buildMobileOptions : (o: LiquidGLOptions) => o;
  window.liquidGL?.(opt(NAV_LIQUID_GL_OPTIONS));
  window.liquidGL?.(opt(ICON_LIQUID_GL_OPTIONS));
  window.liquidGL?.(opt(STAT_BADGE_LIQUID_GL_OPTIONS));
  window.liquidGL?.(opt(ABOUT_CARD_LIQUID_GL_OPTIONS));
  window.liquidGL?.(opt(EXPERIENCE_CARD_LIQUID_GL_OPTIONS));
  window.liquidGL?.(opt(EXPERIENCE_NODE_LIQUID_GL_OPTIONS));
  window.liquidGL?.(opt(TECHNICAL_SKILL_CARD_LIQUID_GL_OPTIONS));
  window.liquidGL?.(opt(PROJECT_CARD_LIQUID_GL_OPTIONS));
  window.liquidGL?.(opt(CONTACT_FOOTER_LIQUID_GL_OPTIONS));
  window.liquidGL?.(opt(CONTACT_FORM_LIQUID_GL_OPTIONS));
  window.liquidGL?.(opt(CONTACT_SEND_BTN_LIQUID_GL_OPTIONS));
  window.liquidGL?.(opt(CONTACT_CONTROL_LIQUID_GL_OPTIONS));
}

export default function LiquidGLInitializer() {
  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout>;
    let lastWidth = window.innerWidth;

    const handleResize = () => {
      // Ignore height-only changes — the mobile browser address bar
      // constantly hides/shows, which changes innerHeight but not innerWidth.
      // Only reinit when the actual layout width changes (e.g. orientation flip).
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;

      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        window.__portfolioLiquidGLReady__ = false;
        window.requestAnimationFrame(initAllLenses);
      }, 300);
    };

    window.addEventListener("orientationchange", () => {
      // orientationchange fires before the new dimensions are settled
      setTimeout(() => {
        lastWidth = window.innerWidth;
        window.__portfolioLiquidGLReady__ = false;
        window.requestAnimationFrame(initAllLenses);
      }, 400);
    });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
      cleanupLiquidGL();
    };
  }, []);

  const handleInit = () => {
    if (typeof window === "undefined" || !window.liquidGL) return;
    if (window.__portfolioLiquidGLReady__) return;
    window.__portfolioLiquidGLReady__ = true;
    window.requestAnimationFrame(initAllLenses);
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
