import { BookOpenText, BriefcaseBusiness, MonitorCog, Stethoscope } from "lucide-react";

const projects = [
  {
    title: "Doctor Smart Tracking System",
    description:
      "A comprehensive tracking and management system designed for healthcare professionals.",
    icon: Stethoscope,
  },
  {
    title: "Hiring Portal",
    description:
      "A streamlined platform for managing job postings, candidate applications, and the recruitment pipeline.",
    icon: BriefcaseBusiness,
  },
  {
    title: "HRM System",
    description:
      "Human Resource Management system for tracking employee data, attendance, and payroll.",
    icon: MonitorCog,
  },
  {
    title: "EDUS LMS",
    description:
      "Learning Management System designed for educational institutions to deliver online courses.",
    icon: BookOpenText,
  },
] as const;

export default function Projects() {
  return (
    <section id="projects" className="projects-section">
      <div className="projects-container">
        <div className="projects-title-wrapper">
          <h2 className="projects-title">Projects</h2>
          <div className="projects-divider"></div>
        </div>

        <div className="projects-grid">
          {projects.map((project) => {
            const Icon = project.icon;

            return (
              <article key={project.title} className="project-card">
                <span className="project-card-lens" aria-hidden="true" />
                <div className="project-card-content" data-liquid-ignore>
                  <div className="project-card-icon-panel" aria-hidden="true">
                    <Icon size={34} strokeWidth={1.9} />
                  </div>
                  <div className="project-card-body">
                    <h3 className="project-card-title">{project.title}</h3>
                    <p className="project-card-description">{project.description}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
