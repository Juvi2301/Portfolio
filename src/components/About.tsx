"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import LiquidGlassBadge from "./LiquidGlassBadge";

function StatNumber({ id, value }: { id: string; value: string }) {
  const filterId = `${id}-liquid-glass`;
  const bodyGradientId = `${id}-body`;
  const rimGradientId = `${id}-rim`;
  const lowerRimGradientId = `${id}-lower-rim`;
  const glyphId = `${id}-glyph`;

  return (
    <svg className="stat-number" viewBox="0 0 168 104" role="img" aria-label={value}>
      <defs>
        <filter id={filterId} x="-18%" y="-22%" width="136%" height="150%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.018 0.05"
            numOctaves="2"
            seed="8"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2.2"
            xChannelSelector="R"
            yChannelSelector="G"
            result="refracted"
          />
          <feGaussianBlur in="refracted" stdDeviation="0.25" result="softGlass" />
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.25" result="alphaBlur" />
          <feSpecularLighting
            in="alphaBlur"
            surfaceScale="6"
            specularConstant="0.48"
            specularExponent="22"
            lightingColor="#ffffff"
            result="specular"
          >
            <fePointLight x="-80" y="-70" z="120" />
          </feSpecularLighting>
          <feComposite in="specular" in2="SourceAlpha" operator="in" result="specularClip" />
          <feDropShadow
            in="softGlass"
            dx="0"
            dy="8"
            stdDeviation="4"
            floodColor="#000000"
            floodOpacity="0.68"
            result="shadowed"
          />
          <feMerge>
            <feMergeNode in="shadowed" />
            <feMergeNode in="specularClip" />
          </feMerge>
        </filter>

        <linearGradient id={bodyGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.09" />
          <stop offset="27%" stopColor="#ffffff" stopOpacity="0.045" />
          <stop offset="50%" stopColor="#05070b" stopOpacity="0.42" />
          <stop offset="65%" stopColor="#ffffff" stopOpacity="0.055" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.025" />
        </linearGradient>

        <linearGradient id={rimGradientId} x1="94%" y1="0%" x2="5%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.34" />
          <stop offset="13%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="34%" stopColor="#ffffff" stopOpacity="0.025" />
          <stop offset="52%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.045" />
        </linearGradient>

        <linearGradient id={lowerRimGradientId} x1="0%" y1="100%" x2="100%" y2="8%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.55" />
          <stop offset="42%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="72%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
        </linearGradient>

        {/* The glyph exists once; the layers below reference it via <use>
            so selecting/copying the page yields the value a single time. */}
        <text id={glyphId} x="8" y="86">{value}</text>
      </defs>

      <g className="stat-number-text" filter={`url(#${filterId})`} aria-hidden="true">
        <use href={`#${glyphId}`} fill="#ffffff" fillOpacity="0.12" />
        <use href={`#${glyphId}`} fill={`url(#${bodyGradientId})`} />
        <use href={`#${glyphId}`} fill="none" stroke={`url(#${rimGradientId})`} strokeWidth="3.1" />
        <use href={`#${glyphId}`} fill="none" stroke={`url(#${lowerRimGradientId})`} strokeWidth="1.8" />
        <use href={`#${glyphId}`} fill="none" stroke="#ffffff" strokeOpacity="0.045" strokeWidth="5.6" />
      </g>
    </svg>
  );
}

function useCountUp(target: number, start: boolean, duration = 1300) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setValue(target);
      return;
    }

    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setValue(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);

  return value;
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

type Seg = { text: string; hl?: boolean };
type Block = { className: string; segs: Seg[] };

/* Card copy as typed blocks. Highlighted segments keep the accent color. */
const ABOUT_BLOCKS: Block[] = [
  {
    className: "about-lede",
    segs: [
      { text: "I'm an " },
      { text: "Associate Software Engineer", hl: true },
      {
        text: " specializing in full-stack web development with the MERN stack — building production-grade applications from database to interface.",
      },
    ],
  },
  {
    className: "about-text",
    segs: [
      {
        text: "After a six-month internship at Yarl Ventures, I joined the team full-time, contributing to production systems including an HR management platform, a learning management system, and a recruitment portal.",
      },
    ],
  },
  {
    className: "about-text",
    segs: [
      { text: "On the frontend I build responsive interfaces with " },
      { text: "React.js", hl: true },
      { text: ", Tailwind CSS, and Ant Design. On the backend I design " },
      { text: "RESTful APIs", hl: true },
      {
        text: " with Node.js, Express.js, and Prisma ORM — working across MongoDB, MySQL, and PostgreSQL, and implementing authentication and role-based access control in Agile teams.",
      },
    ],
  },
];

const BLOCK_LENS = ABOUT_BLOCKS.map((b) =>
  b.segs.reduce((s, seg) => s + seg.text.length, 0)
);
const BLOCK_OFFSETS = BLOCK_LENS.map((_, i) =>
  BLOCK_LENS.slice(0, i).reduce((a, b) => a + b, 0)
);
const TOTAL_CHARS = BLOCK_LENS.reduce((a, b) => a + b, 0);

/* Advances a character counter over time once `start` is true. */
function useTypewriter(start: boolean, total: number, cps = 58) {
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (!start) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setTyped(total);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const n = Math.min(Math.floor(((now - t0) * cps) / 1000), total);
      setTyped(n);
      if (n < total) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, total, cps]);

  return typed;
}

/* Renders the first `revealed` characters of a block's segments. */
function renderSegs(segs: Seg[], revealed: number): ReactNode[] {
  let remaining = revealed;
  const nodes: ReactNode[] = [];
  segs.forEach((seg, i) => {
    if (remaining <= 0) return;
    const take = Math.min(seg.text.length, remaining);
    remaining -= take;
    const slice = seg.text.slice(0, take);
    nodes.push(
      seg.hl ? (
        <span key={i} className="about-highlight">
          {slice}
        </span>
      ) : (
        <span key={i}>{slice}</span>
      )
    );
  });
  return nodes;
}

function TypedBlock({
  block,
  blockLen,
  revealed,
  cursor,
}: {
  block: Block;
  blockLen: number;
  revealed: number;
  cursor: boolean;
}) {
  return (
    <p className={`${block.className} typed-line`}>
      {/* ghost reserves the final height so the card doesn't reflow while typing */}
      <span className="typed-ghost" aria-hidden="true">
        {renderSegs(block.segs, blockLen)}
      </span>
      <span className="typed-real">
        {renderSegs(block.segs, revealed)}
        {cursor && <span className="type-cursor" aria-hidden="true" />}
      </span>
    </p>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const stat1Ref = useRef<HTMLDivElement>(null);
  const stat2Ref = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // [element, stagger offset] — later offset = enters later as you scroll
    const targets: Array<[HTMLElement | null, number]> = [
      [titleRef.current, 0],
      [stat1Ref.current, 0.08],
      [cardRef.current, 0.12],
      [stat2Ref.current, 0.18],
    ];

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      for (const [el] of targets) {
        if (el) {
          el.style.opacity = "1";
          el.style.transform = "none";
        }
      }
      setStarted(true);
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const rect = section.getBoundingClientRect();
      // Section progress: 0 when its top is 88% down the viewport, 1 at 30%.
      const enterStart = vh * 0.88;
      const enterEnd = vh * 0.3;
      const P = clamp((enterStart - rect.top) / (enterStart - enterEnd), 0, 1);

      for (const [el, offset] of targets) {
        if (!el) continue;
        const lp = clamp((P - offset) / 0.55, 0, 1);
        const eased = 1 - Math.pow(1 - lp, 3); // easeOutCubic
        el.style.opacity = String(eased);
        if (eased >= 0.999) {
          // Snap to a true `none` so backdrop-filter glass samples correctly at rest.
          el.style.transform = "none";
        } else {
          const ty = (1 - eased) * 30;
          const sc = 0.985 + eased * 0.015;
          el.style.transform = `translateY(${ty}px) scale(${sc})`;
        }
      }

      if (P > 0.4) setStarted(true);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const years = useCountUp(2, started);
  const projects = useCountUp(5, started);

  const typed = useTypewriter(started, TOTAL_CHARS);
  const done = typed >= TOTAL_CHARS;
  const activeIndex = done
    ? -1
    : ABOUT_BLOCKS.findIndex((_, i) => typed < BLOCK_OFFSETS[i] + BLOCK_LENS[i]);

  return (
    <section id="about" className="about-section" ref={sectionRef}>
      <div className="about-container">

        <div className="about-title-wrapper about-scrub" ref={titleRef}>
          <h2 className="about-title">About Me</h2>
          <div className={`about-divider divider-draw${started ? " is-drawn" : ""}`}></div>
        </div>

        <div className="about-body">

          {/* Left Side: Stats */}
          <div className="about-left">
            <div className="stat-group about-scrub" ref={stat1Ref}>
              <StatNumber id="experience-stat" value={`${years}+`} />
              <LiquidGlassBadge>Years Of Experience</LiquidGlassBadge>
            </div>

            <div className="stat-group about-scrub" ref={stat2Ref}>
              <StatNumber id="project-stat" value={`${projects}+`} />
              <LiquidGlassBadge>Project Complete</LiquidGlassBadge>
            </div>
          </div>

          {/* Right Side: Text Card */}
          <div className="about-right about-scrub" ref={cardRef}>
            <div className="about-card">
              <div className="about-card-content">
                {ABOUT_BLOCKS.map((block, i) => (
                  <TypedBlock
                    key={i}
                    block={block}
                    blockLen={BLOCK_LENS[i]}
                    revealed={clamp(typed - BLOCK_OFFSETS[i], 0, BLOCK_LENS[i])}
                    cursor={i === activeIndex}
                  />
                ))}
                <div className={`about-status${done ? " is-revealed" : ""}`}>
                  <span className="about-status-dot"></span>
                  Currently @ Yarl Ventures &middot; Associate Software Engineer
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
