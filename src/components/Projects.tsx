"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  BookOpenText,
  BriefcaseBusiness,
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

const featured = {
  title: "EDUS — Learning Management System",
  tagline:
    "A full LMS for admins, tutors, students, and coordinators to run academic workflows end to end.",
  icon: BookOpenText,
  tech: ["react", "node", "express", "mongo"],
  points: [
    "Supported admins, tutors, students, and coordinators for managing academic workflows.",
    "Built class management, session scheduling, resource handling, and API integration modules.",
    "Improved usability across multiple LMS features through full-stack development.",
  ],
};

const projects = [
  {
    title: "Hiring Portal",
    tagline:
      "Full-stack recruitment system for Yarl Ventures streamlining end-to-end hiring with role-based workflows.",
    icon: BriefcaseBusiness,
    tech: ["react", "node", "express", "mongo", "antd"],
  },
  {
    title: "HRM System",
    tagline:
      "Internal HR platform automating employee records, attendance, leave management, and payroll.",
    icon: MonitorCog,
    tech: ["react", "node", "express", "mongo"],
  },
  {
    title: "Doctor Smart Tracking",
    tagline:
      "Healthcare app to search doctors by specialization, hospital, and availability with role-based access.",
    icon: Stethoscope,
    tech: ["php", "mysql", "js", "html", "css", "bootstrap"],
  },
  {
    title: "E-Voting System",
    tagline:
      "Secure online voting with voter registration, private ballots, and real-time result tallying.",
    icon: ShieldCheck,
    tech: ["html", "css", "js", "php"],
  },
];

function TechRow({ keys }: { keys: string[] }) {
  return (
    <ul className="project-tech" aria-label="Tech stack">
      {keys.map((k) => {
        const t = TECH[k];
        const Ic = t.Icon;
        return (
          <li
            key={k}
            className="project-tech-item"
            style={{ "--brand": t.color } as CSSProperties}
            title={t.name}
          >
            <Ic className="project-tech-icon" aria-label={t.name} />
          </li>
        );
      })}
    </ul>
  );
}

export default function Projects() {
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
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const revealed = inView ? " is-revealed" : "";
  const FeaturedIcon = featured.icon;

  return (
    <section id="projects" className="projects-section" ref={sectionRef}>
      <div className="projects-container">
        <div className="projects-title-wrapper">
          <h2 className="projects-title">Projects</h2>
          <div className="projects-divider"></div>
        </div>

        <div className="projects-grid">
          <article
            className={`project-card project-card-featured pj-reveal${revealed}`}
            style={{ transitionDelay: "0ms" }}
          >
            <div className="project-featured-visual" aria-hidden="true">
              <span className="project-featured-tag">Featured</span>
              <FeaturedIcon size={56} strokeWidth={1.7} />
            </div>
            <div className="project-featured-body">
              <h3 className="project-featured-title">{featured.title}</h3>
              <p className="project-featured-tagline">{featured.tagline}</p>
              <TechRow keys={featured.tech} />
              <ul className="project-points">
                {featured.points.map((p) => (
                  <li key={p} className="project-point">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </article>

          {projects.map((project, i) => {
            const Icon = project.icon;

            return (
              <article
                key={project.title}
                className={`project-card pj-reveal${revealed}`}
                style={{ transitionDelay: `${120 + i * 90}ms` }}
              >
                <span className="project-card-icon" aria-hidden="true">
                  <Icon size={24} strokeWidth={1.9} />
                </span>
                <h3 className="project-card-name">{project.title}</h3>
                <TechRow keys={project.tech} />
                <p className="project-card-tagline">{project.tagline}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
