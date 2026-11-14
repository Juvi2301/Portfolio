import type { CSSProperties } from "react";
import type { IconType } from "react-icons";
import {
  SiAntdesign,
  SiBootstrap,
  SiCss,
  SiExpress,
  SiFastify,
  SiGit,
  SiHoppscotch,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiNestjs,
  SiNodedotjs,
  SiPhp,
  SiPostgresql,
  SiPostman,
  SiPrisma,
  SiReact,
  SiSpringboot,
  SiTailwindcss,
} from "react-icons/si";
import SectionHeader from "./SectionHeader";

type Category = "frontend" | "backend" | "databases" | "tools";
type Skill = { name: string; Icon: IconType; color: string; category: Category };

// Every skill here was on the site before the redesign. The inner ring holds
// the MERN stack the site already positions Pritheeve on.
const SKILLS: Record<string, Skill> = {
  react: { name: "React.js", Icon: SiReact, color: "#61DAFB", category: "frontend" },
  javascript: { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E", category: "frontend" },
  html: { name: "HTML", Icon: SiHtml5, color: "#E34F26", category: "frontend" },
  css: { name: "CSS", Icon: SiCss, color: "#1572B6", category: "frontend" },
  tailwind: { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#06B6D4", category: "frontend" },
  antd: { name: "Ant Design", Icon: SiAntdesign, color: "#1677FF", category: "frontend" },
  bootstrap: { name: "React Bootstrap", Icon: SiBootstrap, color: "#7952B3", category: "frontend" },
  node: { name: "Node.js", Icon: SiNodedotjs, color: "#5FA04E", category: "backend" },
  express: { name: "Express.js", Icon: SiExpress, color: "#B5BCC9", category: "backend" },
  prisma: { name: "Prisma", Icon: SiPrisma, color: "#8A95F0", category: "backend" },
  nest: { name: "NestJS", Icon: SiNestjs, color: "#E0234E", category: "backend" },
  fastify: { name: "Fastify", Icon: SiFastify, color: "#B5BCC9", category: "backend" },
  spring: { name: "Spring Boot", Icon: SiSpringboot, color: "#6DB33F", category: "backend" },
  php: { name: "PHP", Icon: SiPhp, color: "#8B92C9", category: "backend" },
  mongo: { name: "MongoDB", Icon: SiMongodb, color: "#47A248", category: "databases" },
  mysql: { name: "MySQL", Icon: SiMysql, color: "#4479A1", category: "databases" },
  postgres: { name: "PostgreSQL", Icon: SiPostgresql, color: "#4169E1", category: "databases" },
  git: { name: "Git", Icon: SiGit, color: "#F05032", category: "tools" },
  postman: { name: "Postman", Icon: SiPostman, color: "#FF6C37", category: "tools" },
  hoppscotch: { name: "Hoppscotch", Icon: SiHoppscotch, color: "#1BB497", category: "tools" },
};

// Three rings, inner to outer. `offset` staggers the rings so icons never line up.
const RINGS = [
  { id: "inner", offset: 45, skills: ["react", "node", "express", "mongo"] },
  { id: "middle", offset: 0, skills: ["javascript", "tailwind", "prisma", "mysql", "html", "antd", "nest", "postgres"] },
  { id: "outer", offset: 22, skills: ["css", "bootstrap", "fastify", "spring", "php", "git", "postman", "hoppscotch"] },
];

const GROUPS: { id: Category; title: string; skills: string[] }[] = [
  { id: "frontend", title: "Frontend", skills: ["react", "javascript", "html", "css", "tailwind", "antd", "bootstrap"] },
  { id: "backend", title: "Backend", skills: ["node", "express", "prisma", "nest", "fastify", "spring", "php"] },
  { id: "databases", title: "Databases", skills: ["mongo", "mysql", "postgres"] },
  { id: "tools", title: "Tools", skills: ["git", "postman", "hoppscotch"] },
];

const CORE_SKILLS = new Set(RINGS[0].skills);

export default function TechnicalSkills() {
  return (
    <section id="technical-skills" className="section skills" aria-labelledby="skills-title">
      <div className="section-inner">
        <SectionHeader
          index="02"
          label="Skills"
          titleId="skills-title"
          align="center"
          title={
            <>
              One stack at the core. <span className="title-muted">Sixteen more around it.</span>
            </>
          }
          lede="React, Node.js, Express and MongoDB carry most of my work. Around them sit the frameworks, databases and tools I use on real projects."
        />

        <div className="skills-stage">
          {/* Visual only: the same skills are listed as text in the groups. */}
          <div className="orbit-wrap reveal-orbit" aria-hidden="true">
            <div className="orbit">
              <span className="orbit-light" />
              {RINGS.map((ring) => (
                <div className={`orbit-ring orbit-ring-${ring.id}`} key={ring.id}>
                  {ring.skills.map((key, i) => {
                    const skill = SKILLS[key];
                    const angle = ring.offset + (360 / ring.skills.length) * i;
                    return (
                      <span
                        key={key}
                        className="orbit-node"
                        data-cat={skill.category}
                        style={{ "--a": `${angle}deg`, "--brand": skill.color } as CSSProperties}
                      >
                        <span className="orbit-node-body">
                          <skill.Icon className="orbit-node-icon" />
                          {ring.id === "inner" && <span className="orbit-node-name">{skill.name}</span>}
                        </span>
                      </span>
                    );
                  })}
                </div>
              ))}
              <div className="orbit-core">
                <span className="orbit-core-word">MERN</span>
                <span className="orbit-core-sub">Core stack</span>
              </div>
            </div>
          </div>

          <div className="skill-groups">
            {GROUPS.map((group) => (
              <div className="skill-group glass spotlight reveal" data-cat-trigger={group.id} key={group.id}>
                <h3 className="skill-group-title">{group.title}</h3>
                <ul className="skill-group-list" aria-label={`${group.title} skills`}>
                  {group.skills.map((key) => {
                    const skill = SKILLS[key];
                    const isCore = CORE_SKILLS.has(key);
                    return (
                      <li
                        key={key}
                        className={isCore ? "skill-chip skill-chip-core" : "skill-chip"}
                        style={{ "--brand": skill.color } as CSSProperties}
                      >
                        <skill.Icon className="skill-chip-icon" aria-hidden="true" />
                        {skill.name}
                        {isCore && <span className="visually-hidden"> (core stack)</span>}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            <label className="orbit-toggle">
              <input type="checkbox" role="switch" className="orbit-toggle-input" />
              <span className="orbit-toggle-track" aria-hidden="true" />
              Pause orbit motion
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
