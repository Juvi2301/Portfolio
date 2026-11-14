import { Code2, GraduationCap, type LucideIcon } from "lucide-react";
import SectionHeader from "./SectionHeader";

type Role = {
  id: string;
  title: string;
  company: string;
  period: string;
  year: string;
  type: string;
  current: boolean;
  icon: LucideIcon;
  summary: string;
  points: string[];
};

// Roles, dates and duties come from the client's own published copy (the
// previous About card and Experience section). The intern role has no
// published duties yet, so it shows only what is known.
const INTERN_ROLE: Role = {
  id: "intern",
  title: "Intern Software Engineer",
  company: "Yarl Ventures",
  period: "Aug 2025 – Feb 2026",
  year: "2025",
  type: "Internship, 6 months",
  current: false,
  icon: GraduationCap,
  summary: "Six months on the Yarl Ventures engineering team, which led to the full-time Associate role.",
  points: [],
};

const ASSOCIATE_ROLE: Role = {
  id: "associate",
  title: "Associate Software Engineer",
  company: "Yarl Ventures",
  period: "Feb 2026 – Present",
  year: "2026",
  type: "Full-time",
  current: true,
  icon: Code2,
  summary:
    "Building full-stack web applications for Yarl Ventures' production systems, developing APIs and improving user interfaces.",
  points: [
    "Contribute to an HR management platform, a learning management system and a recruitment portal",
    "Build responsive interfaces with React.js, Tailwind CSS and Ant Design",
    "Design RESTful APIs with Node.js, Express.js and Prisma ORM",
    "Implement authentication and role-based access control in an Agile team",
  ],
};

const MILESTONES = [
  { date: "Aug 2025", label: "Joined as intern" },
  { date: "Feb 2026", label: "Moved to full-time" },
  { date: "Today", label: "Associate Software Engineer", now: true },
];

function RoleCard({ role }: { role: Role }) {
  const Icon = role.icon;

  return (
    <article
      className={role.current ? "role-card role-card-current glass spotlight reveal" : "role-card glass spotlight reveal"}
      data-glass={role.current ? "panel" : undefined}
    >
      <p className="role-year parallax-deep" aria-hidden="true">
        {role.year}
      </p>
      <div className="role-card-top">
        <span className="role-icon" aria-hidden="true">
          <Icon size={20} strokeWidth={1.8} />
        </span>
        <span className="role-type">{role.current ? `Current role · ${role.type}` : role.type}</span>
      </div>
      <p className="role-period">{role.period}</p>
      <h3 className="role-title">{role.title}</h3>
      <p className="role-company">{role.company}</p>
      <p className="role-summary">{role.summary}</p>
      {role.points.length > 0 && (
        <ul className="role-points">
          {role.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="section experience" aria-labelledby="experience-title">
      <div className="section-inner">
        <SectionHeader
          index="03"
          label="Experience"
          titleId="experience-title"
          align="center"
          title={
            <>
              From intern <span className="title-muted">to Associate Engineer.</span>
            </>
          }
          lede="One company, two roles. Six months as an intern at Yarl Ventures, then a full-time place on the same team."
        />

        <div className="journey">
          <div className="journey-line" aria-hidden="true">
            <span className="journey-line-fill" />
          </div>
          <ol className="journey-points">
            {MILESTONES.map((milestone) => (
              <li className={milestone.now ? "journey-point is-now" : "journey-point"} key={milestone.date}>
                <span className="journey-dot" aria-hidden="true" />
                <span className="journey-date">{milestone.date}</span>
                <span className="journey-label">{milestone.label}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="roles">
          <RoleCard role={INTERN_ROLE} />
          <RoleCard role={ASSOCIATE_ROLE} />
        </div>
      </div>
    </section>
  );
}
