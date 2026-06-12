"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Code2, Database, Server, Wrench } from "lucide-react";
import type { IconType } from "react-icons";
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiReact,
  SiBootstrap,
  SiTailwindcss,
  SiAntdesign,
  SiNodedotjs,
  SiExpress,
  SiPhp,
  SiFastify,
  SiPrisma,
  SiMongodb,
  SiMysql,
  SiPostgresql,
  SiGit,
  SiPostman,
  SiHoppscotch,
} from "react-icons/si";

type Skill = { name: string; Icon: IconType; color: string };

const skillGroups: {
  title: string;
  icon: IconType;
  tone: "blue" | "clear";
  skills: Skill[];
}[] = [
  {
    title: "Frontend",
    icon: Code2,
    tone: "blue",
    skills: [
      { name: "HTML", Icon: SiHtml5, color: "#E34F26" },
      { name: "CSS", Icon: SiCss, color: "#1572B6" },
      { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E" },
      { name: "React.js", Icon: SiReact, color: "#61DAFB" },
      { name: "React Bootstrap", Icon: SiBootstrap, color: "#7952B3" },
      { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#06B6D4" },
      { name: "Ant Design", Icon: SiAntdesign, color: "#1677FF" },
    ],
  },
  {
    title: "Backend",
    icon: Server,
    tone: "clear",
    skills: [
      { name: "Node.js", Icon: SiNodedotjs, color: "#5FA04E" },
      { name: "Express.js", Icon: SiExpress, color: "#B5BCC9" },
      { name: "PHP", Icon: SiPhp, color: "#8B92C9" },
      { name: "Fastify", Icon: SiFastify, color: "#B5BCC9" },
      { name: "Prisma", Icon: SiPrisma, color: "#8A95F0" },
    ],
  },
  {
    title: "Databases",
    icon: Database,
    tone: "clear",
    skills: [
      { name: "MongoDB", Icon: SiMongodb, color: "#47A248" },
      { name: "MySQL", Icon: SiMysql, color: "#4479A1" },
      { name: "PostgreSQL", Icon: SiPostgresql, color: "#4169E1" },
    ],
  },
  {
    title: "Tools",
    icon: Wrench,
    tone: "blue",
    skills: [
      { name: "Git", Icon: SiGit, color: "#F05032" },
      { name: "Postman", Icon: SiPostman, color: "#FF6C37" },
      { name: "Hoppscotch", Icon: SiHoppscotch, color: "#1BB497" },
    ],
  },
];

export default function TechnicalSkills() {
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
      { threshold: 0.18 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const reveal = inView ? " is-visible" : "";

  return (
    <section id="technical-skills" className="technical-skills-section" ref={sectionRef}>
      <div className="technical-skills-container">
        <div
          className={`technical-skills-title-wrapper ts-reveal${reveal}`}
          style={{ transitionDelay: "0ms" }}
        >
          <h2 className="technical-skills-title">Technical Skills</h2>
          <div className={`technical-skills-divider divider-draw${inView ? " is-drawn" : ""}`}></div>
        </div>

        <div className="technical-skills-grid">
          {skillGroups.map((group, i) => {
            const Icon = group.icon;

            return (
              <article
                key={group.title}
                className={`technical-skill-card technical-skill-card-${group.tone} ts-reveal${reveal}`}
                style={{ transitionDelay: `${120 + i * 90}ms` }}
              >
                <div className="technical-skill-card-content">
                  <div className="technical-skill-card-head">
                    <span className="technical-skill-icon-badge">
                      <Icon size={17} strokeWidth={2.2} aria-hidden="true" />
                    </span>
                    <h3 className="technical-skill-card-title">{group.title}</h3>
                  </div>

                  <ul className="technical-skill-list" aria-label={`${group.title} skills`}>
                    {group.skills.map(({ name, Icon: SkillIcon, color }) => (
                      <li
                        key={name}
                        className="technical-skill-chip"
                        style={{ "--brand": color } as CSSProperties}
                      >
                        <SkillIcon className="technical-skill-chip-icon" aria-hidden="true" />
                        <span>{name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
