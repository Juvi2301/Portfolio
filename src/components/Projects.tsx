import type { CSSProperties } from "react";
import { ArrowRight, Search } from "lucide-react";
import type { IconType } from "react-icons";
import {
  SiAntdesign,
  SiBootstrap,
  SiCss,
  SiExpress,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiNodedotjs,
  SiPhp,
  SiReact,
} from "react-icons/si";
import SectionHeader from "./SectionHeader";

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

type Visual = "hub" | "pipeline" | "modules" | "search" | "steps";

type Project = {
  id: string;
  title: string;
  category: string;
  context?: string;
  overview: string;
  features: string[];
  contribution?: string[];
  tech: string[];
  visual: Visual;
};

// Copy comes from the project descriptions the client already published on
// this site (current and earlier versions). The diagrams draw only those
// listed features. The three Yarl Ventures systems are team projects, so they
// say "contributed", never "built alone".
const PROJECTS: Project[] = [
  {
    id: "edus",
    title: "EDUS Learning Management System",
    category: "Learning management",
    context: "Yarl Ventures · Team project",
    overview:
      "A learning management system where admins, tutors, students and coordinators run their academic workflows end to end.",
    features: ["Classes", "Sessions", "Resources", "Roles"],
    contribution: [
      "Built class management, session scheduling, resource handling and API integration modules",
      "Improved usability across several LMS features through full-stack work",
    ],
    tech: ["react", "node", "express", "mongo"],
    visual: "hub",
  },
  {
    id: "hiring",
    title: "Hiring Portal",
    category: "Recruitment",
    context: "Yarl Ventures · Team project",
    overview:
      "A full-stack recruitment system for Yarl Ventures that manages job postings, candidate applications and the recruitment pipeline, with role-based workflows.",
    features: ["Job postings", "Applications", "Pipeline"],
    tech: ["react", "node", "express", "mongo", "antd"],
    visual: "pipeline",
  },
  {
    id: "hrm",
    title: "HRM System",
    category: "Human resources",
    context: "Yarl Ventures · Team project",
    overview: "An internal HR platform that keeps employee records and automates attendance, leave and payroll.",
    features: ["Records", "Attendance", "Leave", "Payroll"],
    tech: ["react", "node", "express", "mongo"],
    visual: "modules",
  },
  {
    id: "doctor",
    title: "Doctor Smart Tracking",
    category: "Healthcare",
    overview: "A healthcare web app for finding doctors by specialization, hospital and availability, with role-based access.",
    features: ["Specialization", "Hospital", "Availability"],
    tech: ["php", "mysql", "js", "html", "css", "bootstrap"],
    visual: "search",
  },
  {
    id: "evoting",
    title: "E-Voting System",
    category: "Online voting",
    overview: "An online voting system with voter registration, private ballots and real-time result tallying.",
    features: ["Register", "Vote", "Results"],
    tech: ["html", "css", "js", "php"],
    visual: "steps",
  },
];

// Branch end points for the hub diagram, in % of the visual box.
const HUB_POINTS = [
  { x: 16, y: 22 },
  { x: 84, y: 22 },
  { x: 16, y: 78 },
  { x: 84, y: 78 },
];

function ProjectVisual({ project }: { project: Project }) {
  if (project.visual === "hub") {
    return (
      <div className="pv pv-hub">
        <svg className="pv-hub-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
          {HUB_POINTS.map((point) => (
            <g key={`${point.x}-${point.y}`}>
              <line x1="50" y1="50" x2={point.x} y2={point.y} className="pv-line" vectorEffect="non-scaling-stroke" />
              <line
                x1="50"
                y1="50"
                x2={point.x}
                y2={point.y}
                className="pv-pulse"
                pathLength={100}
                vectorEffect="non-scaling-stroke"
              />
            </g>
          ))}
        </svg>
        <span className="pv-hub-core">EDUS</span>
        {project.features.map((feature, i) => (
          <span
            className="pv-chip pv-hub-node"
            key={feature}
            style={{ "--x": `${HUB_POINTS[i].x}%`, "--y": `${HUB_POINTS[i].y}%` } as CSSProperties}
          >
            {feature}
          </span>
        ))}
      </div>
    );
  }

  if (project.visual === "pipeline") {
    return (
      <ol className="pv pv-pipeline">
        {project.features.map((feature, i) => (
          <li className="pv-chip pv-pipeline-step" key={feature} style={{ "--i": i } as CSSProperties}>
            <span className="pv-step-index">{String(i + 1).padStart(2, "0")}</span>
            {feature}
          </li>
        ))}
      </ol>
    );
  }

  if (project.visual === "modules") {
    return (
      <ul className="pv pv-modules">
        {project.features.map((feature, i) => (
          <li className="pv-chip pv-module" key={feature} style={{ "--i": i } as CSSProperties}>
            {feature}
          </li>
        ))}
      </ul>
    );
  }

  if (project.visual === "search") {
    return (
      <div className="pv pv-search">
        <div className="pv-search-bar">
          <Search size={15} aria-hidden="true" />
          <span>Find a doctor</span>
        </div>
        <ul className="pv-search-filters">
          {project.features.map((feature) => (
            <li className="pv-chip" key={feature}>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <ol className="pv pv-steps">
      {project.features.map((feature, i) => (
        <li className="pv-step" key={feature}>
          <span className="pv-chip">{feature}</span>
          {i < project.features.length - 1 && <ArrowRight className="pv-step-arrow" size={14} aria-hidden="true" />}
        </li>
      ))}
    </ol>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="section projects" aria-labelledby="projects-title">
      <div className="section-inner">
        <SectionHeader
          index="04"
          label="Projects"
          titleId="projects-title"
          title={
            <>
              Selected work <span className="title-muted">across education, hiring, HR and healthcare.</span>
            </>
          }
          lede="Three production systems I contribute to at Yarl Ventures, and two PHP projects."
        />

        <div className="bento project-bento">
          {PROJECTS.map((project) => (
            <article
              key={project.id}
              className={`tile project-tile project-tile-${project.id} glass spotlight reveal`}
              data-glass={project.id === "edus" ? "panel" : undefined}
              aria-labelledby={`project-${project.id}-title`}
            >
              <div className="project-visual" aria-hidden="true">
                <ProjectVisual project={project} />
              </div>

              <div className="project-body">
                <div className="project-meta">
                  <span className="tile-label">{project.category}</span>
                  {project.context && <span className="project-context">{project.context}</span>}
                </div>
                <h3 className="project-title" id={`project-${project.id}-title`}>
                  {project.title}
                </h3>
                <p className="project-overview">{project.overview}</p>

                {project.contribution && (
                  <div className="project-contribution">
                    <h4 className="project-label">My contribution</h4>
                    <ul>
                      {project.contribution.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <ul className="project-tech" aria-label="Stack">
                  {project.tech.map((key) => {
                    const tech = TECH[key];
                    return (
                      <li key={key} style={{ "--brand": tech.color } as CSSProperties}>
                        <tech.Icon aria-hidden="true" />
                        <span>{tech.name}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
