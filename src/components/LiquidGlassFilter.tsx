"use client";

import { useEffect } from "react";

/*
  Liquid glass effect — direct port of the SVG/Canvas displacement-map
  technique from https://github.com/archisvaze/liquid-glass

  Each glass element gets its own per-element SVG filter (displacement map
  + specular highlight map are sized to match the element's pixels), and
  the filter is applied via `backdrop-filter: url(#id)`. Resizes regenerate
  the maps automatically.

  Falls back to the CSS gradients already on each element on browsers that
  don't support backdrop-filter with SVG urls (Safari/iOS).
*/

type SurfaceFn = (x: number) => number;

const SURFACE_FNS: Record<string, SurfaceFn> = {
  convex_squircle: (x) => Math.pow(1 - Math.pow(1 - x, 4), 0.25),
  convex_circle: (x) => Math.sqrt(1 - (1 - x) * (1 - x)),
  concave: (x) => 1 - Math.sqrt(1 - (1 - x) * (1 - x)),
  lip: (x) => {
    const convex = Math.pow(1 - Math.pow(1 - Math.min(x * 2, 1), 4), 0.25);
    const concave = 1 - Math.sqrt(1 - (1 - x) * (1 - x)) + 0.1;
    const t = 6 * x ** 5 - 15 * x ** 4 + 10 * x ** 3;
    return convex * (1 - t) + concave * t;
  },
};

type GlassConfig = {
  surface?: keyof typeof SURFACE_FNS;
  thickness?: number; // glass thickness
  bezel?: number; // bezel width (clamped to <= radius - 1)
  ior?: number; // index of refraction
  scaleRatio?: number; // displacement scale ratio
  blur?: number; // gaussian blur stddev
  specOpacity?: number;
  specSat?: number;
};

const DEFAULT_CONFIG: Required<GlassConfig> = {
  surface: "convex_squircle",
  thickness: 80,
  bezel: 32,
  ior: 1.5,
  scaleRatio: 0.7,
  blur: 0.2,
  specOpacity: 0.55,
  specSat: 3.2,
};

// Per-selector tuning. Smaller elements need smaller bezels so the
// refraction doesn't dominate the whole shape.
const SECTION_CONFIGS: Array<{ selector: string; config?: GlassConfig }> = [
  { selector: ".nav-container", config: { bezel: 28, thickness: 60, blur: 0.25 } },
  { selector: ".icon-wrapper", config: { bezel: 14, thickness: 28, ior: 1.6 } },
  { selector: ".btn-down", config: { bezel: 14, thickness: 30 } },
  { selector: ".liquid-glass-badge", config: { bezel: 16, thickness: 32 } },
  { selector: ".about-card", config: { bezel: 38, thickness: 90, blur: 0.3 } },
  { selector: ".experience-card", config: { bezel: 24, thickness: 60 } },
  { selector: ".experience-node", config: { bezel: 18, thickness: 36 } },
  { selector: ".technical-skill-card", config: { bezel: 26, thickness: 60 } },
  { selector: ".project-card", config: { bezel: 32, thickness: 70 } },
  { selector: ".contact-send-btn", config: { bezel: 12, thickness: 26 } },
  { selector: ".contact-form", config: { bezel: 38, thickness: 90, blur: 0.3 } },
  { selector: ".contact-footer-shell", config: { bezel: 48, thickness: 110, blur: 0.3 } },
  { selector: ".contact-footer-social", config: { bezel: 10, thickness: 22 } },
];

function calculateRefractionProfile(
  glassThickness: number,
  bezelWidth: number,
  heightFn: SurfaceFn,
  ior: number,
  samples = 128
): Float64Array {
  const eta = 1 / ior;
  function refract(nx: number, ny: number): [number, number] | null {
    const dot = ny;
    const k = 1 - eta * eta * (1 - dot * dot);
    if (k < 0) return null;
    const sq = Math.sqrt(k);
    return [-(eta * dot + sq) * nx, eta - (eta * dot + sq) * ny];
  }
  const profile = new Float64Array(samples);
  for (let i = 0; i < samples; i++) {
    const x = i / samples;
    const y = heightFn(x);
    const dx = x < 1 ? 0.0001 : -0.0001;
    const y2 = heightFn(x + dx);
    const deriv = (y2 - y) / dx;
    const mag = Math.sqrt(deriv * deriv + 1);
    const ref = refract(-deriv / mag, -1 / mag);
    if (!ref) {
      profile[i] = 0;
      continue;
    }
    profile[i] = ref[0] * ((y * bezelWidth + glassThickness) / ref[1]);
  }
  return profile;
}

function generateDisplacementMap(
  w: number,
  h: number,
  radius: number,
  bezelWidth: number,
  profile: Float64Array,
  maxDisp: number
): string {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return "";
  const img = ctx.createImageData(w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    d[i] = 128;
    d[i + 1] = 128;
    d[i + 2] = 0;
    d[i + 3] = 255;
  }

  const r = radius;
  const rSq = r * r;
  const r1Sq = (r + 1) ** 2;
  const rBSq = Math.max(r - bezelWidth, 0) ** 2;
  const wB = w - r * 2;
  const hB = h - r * 2;
  const S = profile.length;

  for (let y1 = 0; y1 < h; y1++) {
    for (let x1 = 0; x1 < w; x1++) {
      const x = x1 < r ? x1 - r : x1 >= w - r ? x1 - r - wB : 0;
      const y = y1 < r ? y1 - r : y1 >= h - r ? y1 - r - hB : 0;
      const dSq = x * x + y * y;
      if (dSq > r1Sq || dSq < rBSq) continue;
      const dist = Math.sqrt(dSq);
      const fromSide = r - dist;
      const op = dSq < rSq ? 1 : 1 - (dist - Math.sqrt(rSq)) / (Math.sqrt(r1Sq) - Math.sqrt(rSq));
      if (op <= 0 || dist === 0) continue;
      const cos = x / dist;
      const sin = y / dist;
      const bi = Math.min(((fromSide / bezelWidth) * S) | 0, S - 1);
      const disp = profile[bi] || 0;
      const dX = (-cos * disp) / maxDisp;
      const dY = (-sin * disp) / maxDisp;
      const idx = (y1 * w + x1) * 4;
      d[idx] = (128 + dX * 127 * op + 0.5) | 0;
      d[idx + 1] = (128 + dY * 127 * op + 0.5) | 0;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL();
}

function generateSpecularMap(
  w: number,
  h: number,
  radius: number,
  bezelWidth: number,
  angle = Math.PI / 3
): string {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return "";
  const img = ctx.createImageData(w, h);
  const d = img.data;
  d.fill(0);

  const r = radius;
  const rSq = r * r;
  const r1Sq = (r + 1) ** 2;
  const rBSq = Math.max(r - bezelWidth, 0) ** 2;
  const wB = w - r * 2;
  const hB = h - r * 2;
  const sv = [Math.cos(angle), Math.sin(angle)];

  for (let y1 = 0; y1 < h; y1++) {
    for (let x1 = 0; x1 < w; x1++) {
      const x = x1 < r ? x1 - r : x1 >= w - r ? x1 - r - wB : 0;
      const y = y1 < r ? y1 - r : y1 >= h - r ? y1 - r - hB : 0;
      const dSq = x * x + y * y;
      if (dSq > r1Sq || dSq < rBSq) continue;
      const dist = Math.sqrt(dSq);
      const fromSide = r - dist;
      const op = dSq < rSq ? 1 : 1 - (dist - Math.sqrt(rSq)) / (Math.sqrt(r1Sq) - Math.sqrt(rSq));
      if (op <= 0 || dist === 0) continue;
      const cos = x / dist;
      const sin = -y / dist;
      const dot = Math.abs(cos * sv[0] + sin * sv[1]);
      const edge = Math.sqrt(Math.max(0, 1 - (1 - fromSide) ** 2));
      const coeff = dot * edge;
      const col = (255 * coeff) | 0;
      const alpha = (col * coeff * op) | 0;
      const idx = (y1 * w + x1) * 4;
      d[idx] = col;
      d[idx + 1] = col;
      d[idx + 2] = col;
      d[idx + 3] = alpha;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL();
}

function getElementRadius(el: HTMLElement): number {
  const cs = window.getComputedStyle(el);
  const candidates = [
    cs.borderTopLeftRadius,
    cs.borderTopRightRadius,
    cs.borderBottomRightRadius,
    cs.borderBottomLeftRadius,
  ]
    .map((v) => parseFloat(v))
    .filter((v) => !Number.isNaN(v) && v > 0);
  if (candidates.length === 0) return 12;
  // Use the largest corner radius for the bezel (e.g. About card has a big
  // top-left curve). Clamped later against element dimensions.
  return Math.max(...candidates);
}

type LensState = {
  el: HTMLElement;
  filterId: string;
  config: Required<GlassConfig>;
  lastW: number;
  lastH: number;
  cleanup?: () => void;
};

export default function LiquidGlassFilter() {
  useEffect(() => {
    // Top-level <svg><defs> for all filters
    const SVG_NS = "http://www.w3.org/2000/svg";
    const svgRoot = document.createElementNS(SVG_NS, "svg");
    svgRoot.setAttribute("width", "0");
    svgRoot.setAttribute("height", "0");
    svgRoot.setAttribute("color-interpolation-filters", "sRGB");
    svgRoot.style.cssText =
      "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;left:-9999px";
    const defs = document.createElementNS(SVG_NS, "defs");
    defs.id = "liquid-glass-defs";
    svgRoot.appendChild(defs);
    document.body.appendChild(svgRoot);

    let nextId = 0;
    const lenses: LensState[] = [];

    function rebuildFilter(state: LensState) {
      const { el, config } = state;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (w < 4 || h < 4) return;
      state.lastW = w;
      state.lastH = h;

      const elemRadius = getElementRadius(el);
      // Clamp bezel and radius the same way archisvaze does
      const radius = Math.min(elemRadius, Math.min(w, h) / 2 - 1);
      const bezel = Math.min(config.bezel, radius - 1, Math.min(w, h) / 2 - 1);
      if (radius < 2 || bezel < 2) return;

      const heightFn = SURFACE_FNS[config.surface] ?? SURFACE_FNS.convex_squircle;
      const profile = calculateRefractionProfile(
        config.thickness,
        bezel,
        heightFn,
        config.ior,
        128
      );
      const maxDisp = Math.max(...Array.from(profile).map(Math.abs)) || 1;
      const dispUrl = generateDisplacementMap(w, h, radius, bezel, profile, maxDisp);
      const specUrl = generateSpecularMap(w, h, radius, bezel * 2.5);
      const scale = maxDisp * config.scaleRatio;

      let filter = defs.querySelector(`#${state.filterId}`) as SVGFilterElement | null;
      if (!filter) {
        filter = document.createElementNS(SVG_NS, "filter") as SVGFilterElement;
        filter.id = state.filterId;
        filter.setAttribute("x", "0%");
        filter.setAttribute("y", "0%");
        filter.setAttribute("width", "100%");
        filter.setAttribute("height", "100%");
        defs.appendChild(filter);
      }
      filter.innerHTML = `
        <feGaussianBlur in="SourceGraphic" stdDeviation="${config.blur}" result="blurred_source" />
        <feImage href="${dispUrl}" x="0" y="0" width="${w}" height="${h}" result="disp_map" />
        <feDisplacementMap in="blurred_source" in2="disp_map" scale="${scale}"
          xChannelSelector="R" yChannelSelector="G" result="displaced" />
        <feColorMatrix in="displaced" type="saturate" values="${config.specSat}" result="displaced_sat" />
        <feImage href="${specUrl}" x="0" y="0" width="${w}" height="${h}" result="spec_layer" />
        <feComposite in="displaced_sat" in2="spec_layer" operator="in" result="spec_masked" />
        <feComponentTransfer in="spec_layer" result="spec_faded">
          <feFuncA type="linear" slope="${config.specOpacity}" />
        </feComponentTransfer>
        <feBlend in="spec_masked" in2="displaced" mode="normal" result="with_sat" />
        <feBlend in="spec_faded" in2="with_sat" mode="normal" />
      `;

      const url = `url(#${state.filterId})`;
      el.style.backdropFilter = url;
      // @ts-expect-error vendor prefix
      el.style.webkitBackdropFilter = url;
    }

    // Find and set up all glass elements
    for (const { selector, config: cfgOverride } of SECTION_CONFIGS) {
      const elements = document.querySelectorAll<HTMLElement>(selector);
      elements.forEach((el) => {
        const filterId = `lg-filter-${nextId++}`;
        const config: Required<GlassConfig> = {
          ...DEFAULT_CONFIG,
          ...cfgOverride,
        };
        const state: LensState = { el, filterId, config, lastW: 0, lastH: 0 };
        rebuildFilter(state);
        lenses.push(state);
      });
    }

    console.log(`[liquid-glass] applied to ${lenses.length} element(s)`);

    // Resize observer — regenerate maps when an element resizes by more than 1px
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const dirty = new Set<LensState>();
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const target = entry.target as HTMLElement;
        const state = lenses.find((s) => s.el === target);
        if (!state) continue;
        const w = target.offsetWidth;
        const h = target.offsetHeight;
        if (Math.abs(w - state.lastW) > 1 || Math.abs(h - state.lastH) > 1) {
          dirty.add(state);
        }
      }
      if (dirty.size > 0) {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          dirty.forEach((s) => rebuildFilter(s));
          dirty.clear();
        }, 100);
      }
    });
    lenses.forEach((s) => observer.observe(s.el));

    return () => {
      observer.disconnect();
      if (resizeTimer) clearTimeout(resizeTimer);
      lenses.forEach((s) => {
        s.el.style.backdropFilter = "";
        // @ts-expect-error vendor prefix
        s.el.style.webkitBackdropFilter = "";
      });
      svgRoot.remove();
    };
  }, []);

  return null;
}
