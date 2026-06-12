"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import {
  BookOpenText,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  MonitorCog,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import type { IconType } from "react-icons";
import {
  SiReact,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiAntdesign,
  SiPhp,
  SiMysql,
  SiJavascript,
  SiHtml5,
  SiCss,
  SiBootstrap,
} from "react-icons/si";

type Tech = { name: string; Icon: IconType; color: string };

const TECH: Record<string, Tech> = {
  react: { name: "React.js", Icon: SiReact, color: "#61DAFB" },
  node: { name: "Node.js", Icon: SiNodedotjs, color: "#5FA04E" },
  express: { name: "Express.js", Icon: SiExpress, color: "#B5BCC9" },
  mongo: { name: "MongoDB", Icon: SiMongodb, color: "#47A248" },
  antd: { name: "Ant Design", Icon: SiAntdesign, color: "#1677FF" },
  php: { name: "PHP", Icon: SiPhp, color: "#8B92C9" },
  mysql: { name: "MySQL", Icon: SiMysql, color: "#4479A1" },
  js: { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E" },
  html: { name: "HTML", Icon: SiHtml5, color: "#E34F26" },
  css: { name: "CSS", Icon: SiCss, color: "#1572B6" },
  bootstrap: { name: "Bootstrap", Icon: SiBootstrap, color: "#7952B3" },
};

type Project = {
  title: string;
  tagline: string;
  icon: IconType;
  accent: string;
  tech: string[];
};

const projects: Project[] = [
  {
    title: "EDUS — LMS",
    tagline:
      "A full Learning Management System for admins, tutors, students, and coordinators to run academic workflows end to end.",
    icon: BookOpenText,
    accent: "#3b82f6",
    tech: ["react", "node", "express", "mongo"],
  },
  {
    title: "Hiring Portal",
    tagline:
      "Full-stack recruitment system for Yarl Ventures streamlining end-to-end hiring with role-based workflows.",
    icon: BriefcaseBusiness,
    accent: "#2f7df2",
    tech: ["react", "node", "express", "mongo", "antd"],
  },
  {
    title: "HRM System",
    tagline:
      "Internal HR platform automating employee records, attendance, leave management, and payroll.",
    icon: MonitorCog,
    accent: "#1e6fe6",
    tech: ["react", "node", "express", "mongo"],
  },
  {
    title: "Doctor Smart Tracking",
    tagline:
      "Healthcare app to search doctors by specialization, hospital, and availability with role-based access.",
    icon: Stethoscope,
    accent: "#4f8df5",
    tech: ["php", "mysql", "js", "html", "css", "bootstrap"],
  },
  {
    title: "E-Voting System",
    tagline:
      "Secure online voting with voter registration, private ballots, and real-time result tallying.",
    icon: ShieldCheck,
    accent: "#2563eb",
    tech: ["html", "css", "js", "php"],
  },
];

const COUNT = projects.length;

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

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

  const go = useCallback((dir: number) => {
    setActive((a) => (a + dir + COUNT) % COUNT);
  }, []);

  // Auto-advance (paused on hover / off-screen / reduced motion)
  useEffect(() => {
    if (!inView || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => go(1), 4500);
    return () => clearInterval(id);
  }, [inView, paused, go]);

  return (
    <section id="projects" className="projects-section" ref={sectionRef}>
      <div className="projects-container">
        <div className="projects-title-wrapper">
          <h2 className="projects-title">Projects</h2>
          <div className="projects-divider"></div>
        </div>

        <div
          className={`pc${inView ? " is-in" : ""}`}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="pc-stage">
            {projects.map((p, i) => {
              // circular offset so the fan wraps around (-2 .. 2 for 5 cards)
              let offset = i - active;
              if (offset > COUNT / 2) offset -= COUNT;
              if (offset < -COUNT / 2) offset += COUNT;

              const abs = Math.abs(offset);
              const sign = Math.sign(offset);
              const tx = offset * 54;
              const tz = -abs * 150;
              const ry = -sign * Math.min(abs, 2) * 34;
              const scale = 1 - Math.min(abs, 2) * 0.13;
              const isActive = offset === 0;

              const Icon = p.icon;
              const tone = i % 2 === 0 ? "clear" : "blue";
              const style = {
                transform: `translateX(${tx}%) translateZ(${tz}px) rotateY(${ry}deg) scale(${scale})`,
                opacity: abs > 2 ? 0 : 1 - abs * 0.16,
                zIndex: COUNT - abs,
                pointerEvents: abs > 2 ? "none" : "auto",
              } as CSSProperties;

              return (
                <article
                  key={p.title}
                  className={`pc-card pc-card-${tone}${isActive ? " is-active" : ""}`}
                  style={style}
                  aria-hidden={!isActive}
                  onClick={() => !isActive && setActive(i)}
                >
                  <div className="pc-card-visual">
                    <Icon size={62} strokeWidth={1.6} aria-hidden="true" />
                  </div>
                  <div className="pc-card-body">
                    <h3 className="pc-card-title">{p.title}</h3>
                    <ul className="pc-tech" aria-label="Tech stack">
                      {p.tech.map((k) => {
                        const t = TECH[k];
                        const Ic = t.Icon;
                        return (
                          <li
                            key={k}
                            className="pc-tech-item"
                            style={{ "--brand": t.color } as CSSProperties}
                            title={t.name}
                          >
                            <Ic aria-label={t.name} />
                          </li>
                        );
                      })}
                    </ul>
                    <p className="pc-card-tagline">{p.tagline}</p>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="pc-controls">
            <button
              type="button"
              className="pc-arrow"
              onClick={() => go(-1)}
              aria-label="Previous project"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="pc-dots" role="tablist" aria-label="Project slides">
              {projects.map((p, i) => (
                <button
                  key={p.title}
                  type="button"
                  className={`pc-dot${i === active ? " is-active" : ""}`}
                  onClick={() => setActive(i)}
                  aria-label={`Show ${p.title}`}
                  aria-selected={i === active}
                  role="tab"
                />
              ))}
            </div>

            <button
              type="button"
              className="pc-arrow"
              onClick={() => go(1)}
              aria-label="Next project"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
