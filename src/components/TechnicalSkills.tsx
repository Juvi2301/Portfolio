import { Code2, Database, Server, Wrench } from "lucide-react";

const skillGroups = [
  {
    title: "Frontend",
    icon: Code2,
    tone: "blue",
    skills: ["HTML", "CSS", "JavaScript", "React.js", "React Bootstrap", "Tailwind CSS", "Ant Design"],
  },
  {
    title: "Backend",
    icon: Server,
    tone: "clear",
    skills: ["Node.js", "Express.js", "PHP", "Fastify", "Prisma"],
  },
  {
    title: "Databases",
    icon: Database,
    tone: "clear",
    skills: ["MongoDB", "MySQL", "PostgreSQL"],
  },
  {
    title: "Tools",
    icon: Wrench,
    tone: "blue",
    skills: ["Git", "Postman", "Hoppscotch"],
  },
] as const;

export default function TechnicalSkills() {
  return (
    <section id="technical-skills" className="technical-skills-section">
      <div className="technical-skills-container">
        <div className="technical-skills-title-wrapper">
          <h2 className="technical-skills-title">Technical Skills</h2>
          <div className="technical-skills-divider"></div>
        </div>

        <div className="technical-skills-grid">
          {skillGroups.map((group) => {
            const Icon = group.icon;

            return (
              <article
                key={group.title}
                className={`technical-skill-card technical-skill-card-${group.tone}`}
              >
                <span className="technical-skill-card-lens" aria-hidden="true" />
                <div className="technical-skill-card-content" data-liquid-ignore>
                  <h3 className="technical-skill-card-title">
                    <Icon size={17} strokeWidth={2.4} aria-hidden="true" />
                    <span>{group.title}</span>
                  </h3>
                  <ul className="technical-skill-list" aria-label={`${group.title} skills`}>
                    {group.skills.map((skill) => (
                      <li key={skill} className="technical-skill-chip">
                        {skill}
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
