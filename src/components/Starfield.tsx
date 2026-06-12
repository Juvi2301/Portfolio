import type { CSSProperties } from "react";

type Star = {
  top: number;
  left: number;
  size: number;
  dur: number;
  delay: number;
};

/* Deterministic PRNG so the server-rendered markup matches the client
   (no hydration mismatch) while still looking randomly scattered. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Prominent glowing stars that twinkle individually.
const GLOW_STARS: Star[] = (() => {
  const rng = mulberry32(20240611);
  return Array.from({ length: 46 }, () => ({
    top: +(rng() * 100).toFixed(3),
    left: +(rng() * 100).toFixed(3),
    size: +(2 + rng() * 2.6).toFixed(2),
    dur: +(3.4 + rng() * 4.8).toFixed(2),
    delay: +(rng() * 6).toFixed(2),
  }));
})();

export default function Starfield() {
  return (
    <div className="starfield" aria-hidden="true">
      {GLOW_STARS.map((s, i) => (
        <span
          key={i}
          className="glow-star"
          style={
            {
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              "--dur": `${s.dur}s`,
              "--delay": `${s.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
