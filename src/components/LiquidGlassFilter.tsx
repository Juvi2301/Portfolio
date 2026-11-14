"use client";

import { useEffect } from "react";

/*
  Liquid glass: SVG displacement + specular maps applied through
  `backdrop-filter: url(#id)`. Technique ported from
  https://github.com/archisvaze/liquid-glass.

  Opt an element in with `data-glass="<preset>"`. The element's own CSS glass
  (blur, rim, fill) is what renders first and is the fallback everywhere the
  advanced filter does not run: Safari, Firefox, iOS, data saver, low-memory
  devices, reduced transparency, and surfaces larger than MAX_GLASS_AREA.

  Cost control, measured against the first version (one 270-900 ms long task
  on load for 22 filters):
  - maps are built only when an element comes near the viewport,
  - one element per idle slice, never inside the first paint,
  - elements with the same size, radii and preset share one filter,
  - pixel loops skip the flat interior and touch only the bezel ring,
  - PNG encoding runs through async canvas.toBlob instead of toDataURL.
*/

type GlassConfig = {
  thickness: number; // glass thickness
  bezel: number; // bezel width (clamped to <= radius - 1)
  ior: number; // index of refraction
  scaleRatio: number; // displacement scale ratio
  blur: number; // SVG-internal gaussian blur stddev, before displacement
  cssBlur: number; // CSS backdrop blur in px, composed before the SVG filter
  specOpacity: number;
  specSat: number;
};

const DEFAULT_CONFIG: GlassConfig = {
  thickness: 80,
  bezel: 32,
  ior: 1.5,
  scaleRatio: 0.7,
  blur: 0.2,
  cssBlur: 0,
  specOpacity: 0.55,
  specSat: 3.2,
};

// Smaller elements need smaller bezels so the refraction does not dominate
// the whole shape. nav, orb and button keep the values the hero shipped with.
const PRESETS: Record<string, Partial<GlassConfig>> = {
  nav: { bezel: 28, thickness: 60, blur: 1, cssBlur: 4 },
  orb: { bezel: 14, thickness: 28, ior: 1.6 },
  button: { bezel: 14, thickness: 30 },
  pill: { bezel: 12, thickness: 24 },
  panel: { bezel: 30, thickness: 80, blur: 0.3, cssBlur: 10 },
};

const MAX_GLASS_AREA = 520_000; // px. Larger surfaces keep the CSS glass.
const VIEW_MARGIN = "240px 0px";
const RESIZE_DEBOUNCE_MS = 160;
const IDLE_TIMEOUT_MS = 700;
const MIN_IDLE_MS_FOR_NEXT = 10;
const PROFILE_SAMPLES = 128;
const SPECULAR_ANGLE = Math.PI / 3;

type Radii = readonly [number, number, number, number]; // TL, TR, BR, BL

type FilterEntry = {
  filterId: string;
  users: Set<HTMLElement>;
  cssBlur: number;
  ready: boolean;
  urls: string[];
};

const squircle = (x: number) => Math.pow(1 - Math.pow(1 - x, 4), 0.25);

function calculateRefractionProfile(thickness: number, bezel: number, ior: number): Float64Array {
  const eta = 1 / ior;
  const profile = new Float64Array(PROFILE_SAMPLES);
  for (let i = 0; i < PROFILE_SAMPLES; i++) {
    const x = i / PROFILE_SAMPLES;
    const y = squircle(x);
    const dx = x < 1 ? 0.0001 : -0.0001;
    const deriv = (squircle(x + dx) - y) / dx;
    const mag = Math.sqrt(deriv * deriv + 1);
    const nx = -deriv / mag;
    const ny = -1 / mag;
    const k = 1 - eta * eta * (1 - ny * ny);
    if (k < 0) continue;
    const sq = Math.sqrt(k);
    const refX = -(eta * ny + sq) * nx;
    const refY = eta - (eta * ny + sq) * ny;
    profile[i] = refX * ((y * bezel + thickness) / refY);
  }
  return profile;
}

/**
 * Project a pixel into the (r, x, y) frame of the corner or edge it sits in.
 * Edges use a virtual radius of bezel + 1 so the bezel strip keeps a constant
 * thickness. Returns null for the flat interior.
 */
function localizePixel(x1: number, y1: number, w: number, h: number, radii: Radii, bezel: number) {
  const [rTL, rTR, rBR, rBL] = radii;
  if (x1 < rTL && y1 < rTL) return { r: rTL, x: x1 - rTL, y: y1 - rTL };
  if (x1 >= w - rTR && y1 < rTR) return { r: rTR, x: x1 - (w - rTR), y: y1 - rTR };
  if (x1 >= w - rBR && y1 >= h - rBR) return { r: rBR, x: x1 - (w - rBR), y: y1 - (h - rBR) };
  if (x1 < rBL && y1 >= h - rBL) return { r: rBL, x: x1 - rBL, y: y1 - (h - rBL) };

  const er = bezel + 1;
  if (y1 < bezel && x1 >= rTL && x1 < w - rTR) return { r: er, x: 0, y: y1 - er };
  if (y1 >= h - bezel && x1 >= rBL && x1 < w - rBR) return { r: er, x: 0, y: y1 - (h - er) };
  if (x1 < bezel && y1 >= rTL && y1 < h - rBL) return { r: er, x: x1 - er, y: 0 };
  if (x1 >= w - bezel && y1 >= rTR && y1 < h - rBR) return { r: er, x: x1 - (w - er), y: 0 };
  return null;
}

function createContext(w: number, h: number) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  // CPU-backed canvas: putImageData + encode without a GPU read-back.
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  return { canvas, ctx };
}

function paintDisplacementMap(
  w: number,
  h: number,
  radii: Radii,
  bezel: number,
  profile: Float64Array,
  maxDisp: number
): HTMLCanvasElement | null {
  const { canvas, ctx } = createContext(w, h);
  if (!ctx) return null;
  const img = ctx.createImageData(w, h);
  const d = img.data;
  // Neutral displacement (R=128, G=128, B=0, A=255) everywhere, written as
  // little-endian 32-bit words in one pass.
  new Uint32Array(d.buffer).fill(0xff008080);

  // Every non-neutral pixel lies within `band` of an edge, so the interior
  // of each middle row is skipped.
  const band = Math.ceil(Math.max(bezel, ...radii)) + 1;
  const samples = profile.length;

  for (let y1 = 0; y1 < h; y1++) {
    const fullRow = y1 < band || y1 >= h - band;
    for (let x1 = 0; x1 < w; x1++) {
      if (!fullRow && x1 >= band && x1 < w - band) x1 = w - band;
      const loc = localizePixel(x1, y1, w, h, radii, bezel);
      if (!loc) continue;
      const { r, x, y } = loc;
      const rSq = r * r;
      const r1Sq = (r + 1) ** 2;
      const rBSq = Math.max(r - bezel, 0) ** 2;
      const dSq = x * x + y * y;
      if (dSq > r1Sq || dSq < rBSq) continue;
      const dist = Math.sqrt(dSq);
      const op = dSq < rSq ? 1 : 1 - (dist - r) / (Math.sqrt(r1Sq) - r);
      if (op <= 0 || dist === 0) continue;
      const bi = Math.min((((r - dist) / bezel) * samples) | 0, samples - 1);
      const disp = profile[bi] || 0;
      const idx = (y1 * w + x1) * 4;
      d[idx] = (128 + ((-(x / dist) * disp) / maxDisp) * 127 * op + 0.5) | 0;
      d[idx + 1] = (128 + ((-(y / dist) * disp) / maxDisp) * 127 * op + 0.5) | 0;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

function paintSpecularMap(w: number, h: number, radii: Radii, bezel: number): HTMLCanvasElement | null {
  const { canvas, ctx } = createContext(w, h);
  if (!ctx) return null;
  const img = ctx.createImageData(w, h);
  const d = img.data;
  const lightX = Math.cos(SPECULAR_ANGLE);
  const lightY = Math.sin(SPECULAR_ANGLE);

  // The highlight is a rim: `edge` below is 0 once a pixel is 2px inside the
  // shape, so only the corners and a thin edge strip need visiting.
  const band = Math.ceil(Math.max(3, ...radii)) + 1;

  for (let y1 = 0; y1 < h; y1++) {
    const fullRow = y1 < band || y1 >= h - band;
    for (let x1 = 0; x1 < w; x1++) {
      if (!fullRow && x1 >= band && x1 < w - band) x1 = w - band;
      const loc = localizePixel(x1, y1, w, h, radii, bezel);
      if (!loc) continue;
      const { r, x, y } = loc;
      const rSq = r * r;
      const r1Sq = (r + 1) ** 2;
      const rBSq = Math.max(r - bezel, 0) ** 2;
      const dSq = x * x + y * y;
      if (dSq > r1Sq || dSq < rBSq) continue;
      const dist = Math.sqrt(dSq);
      const op = dSq < rSq ? 1 : 1 - (dist - r) / (Math.sqrt(r1Sq) - r);
      if (op <= 0 || dist === 0) continue;
      const fromSide = r - dist;
      const dot = Math.abs((x / dist) * lightX + (-y / dist) * lightY);
      const edge = Math.sqrt(Math.max(0, 1 - (1 - fromSide) ** 2));
      const coeff = dot * edge;
      const col = (255 * coeff) | 0;
      const idx = (y1 * w + x1) * 4;
      d[idx] = col;
      d[idx + 1] = col;
      d[idx + 2] = col;
      d[idx + 3] = (col * coeff * op) | 0;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

function encodeCanvas(canvas: HTMLCanvasElement): Promise<string> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob ? URL.createObjectURL(blob) : canvas.toDataURL());
    });
  });
}

function readRadii(el: HTMLElement, w: number, h: number): Radii {
  const cs = window.getComputedStyle(el);
  // Clamp each corner against the half-extent so a big radius on a small
  // element still produces a valid shape.
  const halfMin = Math.min(w, h) / 2 - 1;
  const clampRadius = (value: string) => {
    const n = parseFloat(value);
    if (Number.isNaN(n) || n <= 0) return 0;
    return Math.min(n, halfMin);
  };
  return [
    clampRadius(cs.borderTopLeftRadius),
    clampRadius(cs.borderTopRightRadius),
    clampRadius(cs.borderBottomRightRadius),
    clampRadius(cs.borderBottomLeftRadius),
  ] as const;
}

type NavigatorHints = Navigator & {
  userAgentData?: { brands: { brand: string }[] };
  connection?: { saveData?: boolean };
  deviceMemory?: number;
};

function canRunAdvancedGlass(): boolean {
  const nav = navigator as NavigatorHints;
  // Only Chromium renders SVG filters inside backdrop-filter. Safari and
  // Firefox (and every iOS browser) have no userAgentData, so they keep the
  // CSS glass and skip the map work entirely.
  const isChromium = nav.userAgentData?.brands.some((b) => b.brand === "Chromium") ?? false;
  if (!isChromium || !CSS.supports("backdrop-filter", "url(#a)")) return false;
  if (nav.connection?.saveData) return false;
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return false;
  if (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 2) return false;
  if (window.matchMedia("(prefers-reduced-transparency: reduce)").matches) return false;
  return true;
}

export default function LiquidGlassFilter() {
  useEffect(() => {
    if (!canRunAdvancedGlass()) return;

    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-glass]"));
    if (elements.length === 0) return;

    const SVG_NS = "http://www.w3.org/2000/svg";
    const svgRoot = document.createElementNS(SVG_NS, "svg");
    svgRoot.setAttribute("width", "0");
    svgRoot.setAttribute("height", "0");
    svgRoot.setAttribute("aria-hidden", "true");
    svgRoot.setAttribute("color-interpolation-filters", "sRGB");
    svgRoot.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;left:-9999px";
    const defs = document.createElementNS(SVG_NS, "defs");
    svgRoot.appendChild(defs);
    document.body.appendChild(svgRoot);

    const filters = new Map<string, FilterEntry>(); // cache key -> shared filter
    const elementKey = new Map<HTMLElement, string>();
    const lastSize = new Map<HTMLElement, { w: number; h: number }>();
    const activated = new Set<HTMLElement>();
    const queue: HTMLElement[] = [];
    let nextId = 0;
    let disposed = false;
    let idleHandle = 0;
    let usingIdleCallback = false;
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;

    function applyFilter(el: HTMLElement, entry: FilterEntry) {
      const blur = entry.cssBlur > 0 ? `blur(${entry.cssBlur}px) ` : "";
      const value = `${blur}url(#${entry.filterId})`;
      el.style.backdropFilter = value;
      el.style.setProperty("-webkit-backdrop-filter", value);
      el.dataset.glassActive = "";
    }

    function clearFilter(el: HTMLElement) {
      el.style.backdropFilter = "";
      el.style.removeProperty("-webkit-backdrop-filter");
      delete el.dataset.glassActive;
    }

    function destroyEntry(key: string, entry: FilterEntry) {
      filters.delete(key);
      defs.querySelector(`#${entry.filterId}`)?.remove();
      entry.urls.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    }

    // Detach an element from its shared filter; the last user frees it.
    function releaseElement(el: HTMLElement) {
      const key = elementKey.get(el);
      if (!key) return;
      elementKey.delete(el);
      clearFilter(el);
      const entry = filters.get(key);
      if (!entry) return;
      entry.users.delete(el);
      if (entry.users.size === 0) destroyEntry(key, entry);
    }

    async function buildFilter(key: string, entry: FilterEntry, w: number, h: number, radii: Radii, config: GlassConfig) {
      const nonZero = radii.filter((r) => r > 0);
      const minCorner = Math.min(...nonZero);
      const bezel = Math.max(2, Math.min(config.bezel, minCorner - 1, Math.min(w, h) / 2 - 1));
      const profile = calculateRefractionProfile(config.thickness, bezel, config.ior);
      let maxDisp = 0;
      for (let i = 0; i < profile.length; i++) maxDisp = Math.max(maxDisp, Math.abs(profile[i]));
      if (maxDisp === 0) maxDisp = 1;

      const dispCanvas = paintDisplacementMap(w, h, radii, bezel, profile, maxDisp);
      const specCanvas = paintSpecularMap(w, h, radii, bezel * 2.5);
      if (!dispCanvas || !specCanvas) return;

      const [dispUrl, specUrl] = await Promise.all([encodeCanvas(dispCanvas), encodeCanvas(specCanvas)]);
      entry.urls = [dispUrl, specUrl];
      // The element may have resized or unmounted while the PNGs encoded.
      if (disposed || filters.get(key) !== entry || entry.users.size === 0) {
        destroyEntry(key, entry);
        return;
      }

      const filter = document.createElementNS(SVG_NS, "filter");
      filter.id = entry.filterId;
      filter.setAttribute("x", "0%");
      filter.setAttribute("y", "0%");
      filter.setAttribute("width", "100%");
      filter.setAttribute("height", "100%");
      filter.innerHTML = `
        <feGaussianBlur in="SourceGraphic" stdDeviation="${config.blur}" result="blurred_source" />
        <feImage href="${dispUrl}" x="0" y="0" width="${w}" height="${h}" result="disp_map" />
        <feDisplacementMap in="blurred_source" in2="disp_map" scale="${maxDisp * config.scaleRatio}"
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
      defs.appendChild(filter);
      entry.ready = true;
      entry.users.forEach((user) => applyFilter(user, entry));
    }

    function buildLens(el: HTMLElement) {
      if (!el.isConnected) return;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      lastSize.set(el, { w, h });
      if (w < 4 || h < 4 || w * h > MAX_GLASS_AREA) return;

      const radii = readRadii(el, w, h);
      if (Math.max(...radii) < 2) return;

      const preset = el.dataset.glass || "panel";
      const config: GlassConfig = { ...DEFAULT_CONFIG, ...PRESETS[preset] };
      const key = `${preset}|${w}x${h}|${radii.join(",")}`;
      if (elementKey.get(el) === key) return;
      releaseElement(el);

      let entry = filters.get(key);
      const isNew = !entry;
      if (!entry) {
        entry = { filterId: `lg-${nextId++}`, users: new Set(), cssBlur: config.cssBlur, ready: false, urls: [] };
        filters.set(key, entry);
      }
      entry.users.add(el);
      elementKey.set(el, key);

      if (entry.ready) applyFilter(el, entry);
      else if (isNew) void buildFilter(key, entry, w, h, radii, config);
    }

    function runQueue(deadline?: IdleDeadline) {
      idleHandle = 0;
      while (queue.length > 0 && !disposed) {
        const el = queue.shift();
        if (el) buildLens(el);
        if (!deadline || deadline.timeRemaining() < MIN_IDLE_MS_FOR_NEXT) break;
      }
      if (queue.length > 0 && !disposed) scheduleQueue();
    }

    function scheduleQueue() {
      if (idleHandle) return;
      if (typeof window.requestIdleCallback === "function") {
        usingIdleCallback = true;
        idleHandle = window.requestIdleCallback(runQueue, { timeout: IDLE_TIMEOUT_MS });
      } else {
        idleHandle = window.setTimeout(() => runQueue(), 32);
      }
    }

    function enqueue(el: HTMLElement) {
      if (!queue.includes(el)) queue.push(el);
      scheduleQueue();
    }

    const viewObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          viewObserver.unobserve(el);
          activated.add(el);
          enqueue(el);
        }
      },
      { rootMargin: VIEW_MARGIN }
    );

    // Rebuild only elements that are already active and really changed size.
    const resizeObserver = new ResizeObserver((entries) => {
      let changed = false;
      for (const entry of entries) {
        const el = entry.target as HTMLElement;
        if (!activated.has(el)) continue;
        const prev = lastSize.get(el);
        if (!prev || Math.abs(el.offsetWidth - prev.w) > 1 || Math.abs(el.offsetHeight - prev.h) > 1) {
          changed = true;
        }
      }
      if (!changed) return;
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        activated.forEach((el) => {
          const prev = lastSize.get(el);
          if (!prev || Math.abs(el.offsetWidth - prev.w) > 1 || Math.abs(el.offsetHeight - prev.h) > 1) {
            enqueue(el);
          }
        });
      }, RESIZE_DEBOUNCE_MS);
    });

    elements.forEach((el) => {
      viewObserver.observe(el);
      resizeObserver.observe(el);
    });

    return () => {
      disposed = true;
      viewObserver.disconnect();
      resizeObserver.disconnect();
      if (resizeTimer) clearTimeout(resizeTimer);
      if (idleHandle) {
        if (usingIdleCallback) window.cancelIdleCallback(idleHandle);
        else clearTimeout(idleHandle);
      }
      elementKey.forEach((_, el) => clearFilter(el));
      filters.forEach((entry, key) => destroyEntry(key, entry));
      svgRoot.remove();
    };
  }, []);

  return null;
}
