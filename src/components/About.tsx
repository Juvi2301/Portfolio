import { Database, GraduationCap, MonitorSmartphone, Server } from "lucide-react";
import SectionHeader from "./SectionHeader";

// Every fact below comes from copy the client already published on this site
// (About card, Experience periods, footer bio). Nothing is estimated: the big
// numbers are a year and a count of named systems, not claims of scale.
const CAPABILITIES = [
  {
    title: "Interfaces",
    icon: MonitorSmartphone,
    text: "Responsive React.js interfaces with Tailwind CSS and Ant Design.",
  },
  {
    title: "APIs",
    icon: Server,
    text: "RESTful APIs with Node.js, Express.js and Prisma ORM.",
  },
  {
    title: "Data and access",
    icon: Database,
    text: "MongoDB, MySQL and PostgreSQL, with authentication and role-based access.",
  },
  {
    title: "Education",
    icon: GraduationCap,
    text: "Higher National Diploma in Information Technology, SLIATE.",
  },
];

export default function About() {
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="section-inner">
        <SectionHeader
          index="01"
          label="About"
          titleId="about-title"
          align="center"
          title={
            <>
              Full-stack engineering, <span className="title-muted">from interface to database.</span>
            </>
          }
          lede="I'm Thayalan Pritheeve, an Associate Software Engineer at Yarl Ventures. I build practical web applications with React, Node.js, Express and the databases behind them."
        />

        <div className="bento about-bento">
          <article className="tile tile-journey glass spotlight reveal" data-glass="panel">
            <p className="tile-label">Journey</p>
            <p className="tile-figure parallax-figure" aria-hidden="true">
              2025
            </p>
            <div className="tile-foot">
              <h3 className="tile-title">Intern to full-time in six months.</h3>
              <p className="tile-text">
                I joined Yarl Ventures as an intern in August 2025 and moved to a full-time role on the same team
                in February 2026.
              </p>
            </div>
          </article>

          <article className="tile tile-now glass spotlight reveal">
            <p className="tile-label">
              <span className="status-dot" aria-hidden="true" />
              Now
            </p>
            <h3 className="tile-title">Associate Software Engineer</h3>
            <p className="tile-text">Yarl Ventures</p>
          </article>

          <article className="tile tile-systems glass spotlight reveal">
            <p className="tile-label">Production work</p>
            <div className="tile-figure-row">
              <p className="tile-figure tile-figure-small parallax-figure" aria-hidden="true">
                3
              </p>
              <p className="tile-text">
                Production systems I contribute to: HR management, learning management and recruitment.
              </p>
            </div>
          </article>

          {CAPABILITIES.map((item) => {
            const Icon = item.icon;
            return (
              <article className="tile tile-skill glass spotlight reveal" key={item.title}>
                <span className="tile-icon" aria-hidden="true">
                  <Icon size={20} strokeWidth={1.8} />
                </span>
                <h3 className="tile-title tile-title-small">{item.title}</h3>
                <p className="tile-text">{item.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
