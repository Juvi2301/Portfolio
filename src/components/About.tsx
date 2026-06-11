"use client";

import { useEffect, useRef, useState } from "react";
import LiquidGlassBadge from "./LiquidGlassBadge";

function StatNumber({ id, value }: { id: string; value: string }) {
  const filterId = `${id}-liquid-glass`;
  const bodyGradientId = `${id}-body`;
  const rimGradientId = `${id}-rim`;
  const lowerRimGradientId = `${id}-lower-rim`;

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
      </defs>

      <g className="stat-number-text" filter={`url(#${filterId})`}>
        <text x="8" y="86" fill="#ffffff" fillOpacity="0.12">{value}</text>
        <text x="8" y="86" fill={`url(#${bodyGradientId})`}>{value}</text>
        <text x="8" y="86" fill="none" stroke={`url(#${rimGradientId})`} strokeWidth="3.1">{value}</text>
        <text x="8" y="86" fill="none" stroke={`url(#${lowerRimGradientId})`} strokeWidth="1.8">{value}</text>
        <text x="8" y="86" fill="none" stroke="#ffffff" strokeOpacity="0.045" strokeWidth="5.6">{value}</text>
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

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const years = useCountUp(2, inView);
  const projects = useCountUp(5, inView);
  const shown = (cls: string) => `${cls} about-reveal${inView ? " is-visible" : ""}`;

  return (
    <section id="about" className="about-section" ref={sectionRef}>
      <div className="about-container">

        <div className={shown("about-title-wrapper")} style={{ transitionDelay: "0ms" }}>
          <h2 className="about-title">About Me</h2>
          <div className="about-divider"></div>
        </div>

        <div className="about-body">

          {/* Left Side: Stats */}
          <div className="about-left">
            <div className={shown("stat-group")} style={{ transitionDelay: "120ms" }}>
              <StatNumber id="experience-stat" value={`${years}+`} />
              <LiquidGlassBadge>Years Of Experience</LiquidGlassBadge>
            </div>

            <div className={shown("stat-group")} style={{ transitionDelay: "220ms" }}>
              <StatNumber id="project-stat" value={`${projects}+`} />
              <LiquidGlassBadge>Project Complete</LiquidGlassBadge>
            </div>
          </div>

          {/* Right Side: Text Card */}
          <div className={shown("about-right")} style={{ transitionDelay: "180ms" }}>
            <div className="about-card">
              <div className="about-card-content">
              <p className="about-lede">
                I&apos;m an <span className="about-highlight">Associate Software Engineer</span> specializing in full-stack web development with the MERN stack &mdash; building production-grade applications from database to interface.
              </p>
              <p className="about-text">
                After a six-month internship at Yarl Ventures, I joined the team full-time, contributing to production systems including an HR management platform, a learning management system, and a recruitment portal.
              </p>
              <p className="about-text">
                On the frontend I build responsive interfaces with <span className="about-highlight">React.js</span>, Tailwind CSS, and Ant Design. On the backend I design <span className="about-highlight">RESTful APIs</span> with Node.js, Express.js, and Prisma ORM &mdash; working across MongoDB, MySQL, and PostgreSQL, and implementing authentication and role-based access control in Agile teams.
              </p>
              <div className="about-status">
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
