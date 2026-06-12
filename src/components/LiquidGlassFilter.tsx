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
  blur?: number; // SVG-internal gaussian blur stddev (subtle, pre-displacement)
  cssBlur?: number; // CSS backdrop-filter blur in px (frosted glass look)
  specOpacity?: number;
};

const DEFAULT_CONFIG: Required<GlassConfig> = {
  surface: "convex_squircle",
  thickness: 80,
  bezel: 32,
  ior: 1.5,
  scaleRatio: 0.7,
  blur: 0.2,
  cssBlur: 0,
  specOpacity: 0.55,
};

// Per-selector tuning. Smaller elements need smaller bezels so the
// refraction doesn't dominate the whole shape.
const SECTION_CONFIGS: Array<{ selector: string; config?: GlassConfig }> = [
  { selector: ".nav-container", config: { bezel: 28, thickness: 60, blur: 1, cssBlur: 4 } },
  { selector: ".icon-wrapper", config: { bezel: 14, thickness: 28, ior: 1.6 } },
  { selector: ".btn-down", config: { bezel: 14, thickness: 30 } },
  { selector: ".liquid-glass-badge", config: { bezel: 16, thickness: 32 } },
  { selector: ".about-card", config: { bezel: 38, thickness: 90, blur: 0.3 } },
  { selector: ".experience-card", config: { bezel: 24, thickness: 60 } },
  { selector: ".experience-node", config: { bezel: 18, thickness: 36 } },
  { selector: ".technical-skill-card", config: { bezel: 26, thickness: 60 } },
  /* Note: the project carousel (.pc-card) intentionally has no glass filter —
     those cards animate 3D transforms constantly, which would force the
     filter to re-run every frame, and their backgrounds are ~95% opaque so
     refraction wouldn't be visible anyway. */
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

type Radii = readonly [number, number, number, number]; // TL, TR, BR, BL

/**
 * Walk every pixel and project it into a (r, x, y) local frame depending on
 * whether it sits in a corner or edge of the asymmetric rounded rectangle.
 *
 * Corners use their own radius. Edges use a "virtual radius" = bezelWidth + 1
 * so the bezel-depth math (fromSide = r - dist) still produces a clean strip
 * of constant thickness along the edge.
 */
function localizePixel(
  x1: number,
  y1: number,
  w: number,
  h: number,
  radii: Radii,
  bezelWidth: number
): { r: number; x: number; y: number } | null {
  const [rTL, rTR, rBR, rBL] = radii;
  // Corners first
  if (x1 < rTL && y1 < rTL) return { r: rTL, x: x1 - rTL, y: y1 - rTL };
  if (x1 >= w - rTR && y1 < rTR) return { r: rTR, x: x1 - (w - rTR), y: y1 - rTR };
  if (x1 >= w - rBR && y1 >= h - rBR) return { r: rBR, x: x1 - (w - rBR), y: y1 - (h - rBR) };
  if (x1 < rBL && y1 >= h - rBL) return { r: rBL, x: x1 - rBL, y: y1 - (h - rBL) };

  // Edges — use virtual r so the bezel strip stays constant-thickness
  const er = bezelWidth + 1;
  // Top edge
  if (y1 < bezelWidth && x1 >= rTL && x1 < w - rTR) {
    return { r: er, x: 0, y: y1 - er };
  }
  // Bottom edge
  if (y1 >= h - bezelWidth && x1 >= rBL && x1 < w - rBR) {
    return { r: er, x: 0, y: y1 - (h - er) };
  }
  // Left edge
  if (x1 < bezelWidth && y1 >= rTL && y1 < h - rBL) {
    return { r: er, x: x1 - er, y: 0 };
  }
  // Right edge
  if (x1 >= w - bezelWidth && y1 >= rTR && y1 < h - rBR) {
    return { r: er, x: x1 - (w - er), y: 0 };
  }
  return null;
}

function generateDisplacementMap(
  w: number,
  h: number,
  radii: Radii,
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

  const S = profile.length;

  for (let y1 = 0; y1 < h; y1++) {
    for (let x1 = 0; x1 < w; x1++) {
      const loc = localizePixel(x1, y1, w, h, radii, bezelWidth);
      if (!loc) continue;
      const { r, x, y } = loc;
      const rSq = r * r;
      const r1Sq = (r + 1) ** 2;
      const rBSq = Math.max(r - bezelWidth, 0) ** 2;
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

/* The specular layer's overall opacity is baked into the map's alpha here,
   so the live filter chain can blend it directly without an extra
   feComponentTransfer pass per frame. */
function generateSpecularMap(
  w: number,
  h: number,
  radii: Radii,
  bezelWidth: number,
  opacityScale: number,
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

  const sv = [Math.cos(angle), Math.sin(angle)];

  for (let y1 = 0; y1 < h; y1++) {
    for (let x1 = 0; x1 < w; x1++) {
      const loc = localizePixel(x1, y1, w, h, radii, bezelWidth);
      if (!loc) continue;
      const { r, x, y } = loc;
      const rSq = r * r;
      const r1Sq = (r + 1) ** 2;
      const rBSq = Math.max(r - bezelWidth, 0) ** 2;
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
      const alpha = (col * coeff * op * opacityScale) | 0;
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

function getElementRadii(el: HTMLElement): Radii {
  const cs = window.getComputedStyle(el);
  const parse = (v: string) => {
    const n = parseFloat(v);
    return Number.isNaN(n) || n <= 0 ? 0 : n;
  };
  return [
    parse(cs.borderTopLeftRadius),
    parse(cs.borderTopRightRadius),
    parse(cs.borderBottomRightRadius),
    parse(cs.borderBottomLeftRadius),
  ] as const;
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

      const rawRadii = getElementRadii(el);
      // Clamp each corner against the element's half-extent so a 60px corner
      // on a tiny element falls back gracefully.
      const halfMin = Math.min(w, h) / 2 - 1;
      const radii = rawRadii.map((r) => Math.max(0, Math.min(r, halfMin))) as unknown as Radii;
      const maxRadius = Math.max(...radii);
      if (maxRadius < 2) return;
      // Bezel can't be larger than the smallest non-zero corner — otherwise
      // the bezel ring eats through to the inside of small corners.
      const nonZeroRadii = radii.filter((r) => r > 0);
      const minCornerR = nonZeroRadii.length > 0 ? Math.min(...nonZeroRadii) : maxRadius;
      const bezel = Math.max(2, Math.min(config.bezel, minCornerR - 1, halfMin));

      const heightFn = SURFACE_FNS[config.surface] ?? SURFACE_FNS.convex_squircle;
      const profile = calculateRefractionProfile(
        config.thickness,
        bezel,
        heightFn,
        config.ior,
        128
      );
      const maxDisp = Math.max(...Array.from(profile).map(Math.abs)) || 1;
      const dispUrl = generateDisplacementMap(w, h, radii, bezel, profile, maxDisp);
      const specUrl = generateSpecularMap(w, h, radii, bezel * 2.5, config.specOpacity);
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
      /* Minimal per-frame chain. backdrop-filter re-runs this every time the
         backdrop changes (i.e. every scroll frame), so each primitive here is
         paid dozens of times per second per element. The two feImages are
         static textures the browser caches; the real work is one displacement
         pass + one blend. The sub-pixel pre-blur is skipped when it's too
         small to see, and the specular fade is pre-baked into the map's alpha. */
      const subtleBlur = config.blur >= 0.3;
      filter.innerHTML = `
        ${subtleBlur ? `<feGaussianBlur in="SourceGraphic" stdDeviation="${config.blur}" result="blurred_source" />` : ""}
        <feImage href="${dispUrl}" x="0" y="0" width="${w}" height="${h}" result="disp_map" />
        <feDisplacementMap in="${subtleBlur ? "blurred_source" : "SourceGraphic"}" in2="disp_map" scale="${scale}"
          xChannelSelector="R" yChannelSelector="G" result="displaced" />
        <feImage href="${specUrl}" x="0" y="0" width="${w}" height="${h}" result="spec_layer" />
        <feBlend in="spec_layer" in2="displaced" mode="normal" />
      `;

      // Compose: CSS blur first (frosted glass), then SVG displacement
      const cssBlur = config.cssBlur > 0 ? `blur(${config.cssBlur}px) ` : "";
      const value = `${cssBlur}url(#${state.filterId})`;
      el.style.backdropFilter = value;
      // @ts-expect-error vendor prefix
      el.style.webkitBackdropFilter = value;
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
