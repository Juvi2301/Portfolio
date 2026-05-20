import { Code2, UserRound } from "lucide-react";

const experiences = [
  {
    id: "associate",
    period: "Past",
    title: "Associate Software Engineer",
    company: "Yarl Ventures",
    side: "right",
    icon: Code2,
    tone: "blue",
  },
  {
    id: "intern",
    period: "Past",
    title: "Intern Software Engineer",
    company: "Yarl Ventures",
    side: "left",
    icon: UserRound,
    tone: "dark",
  },
] as const;

export default function Experience() {
  return (
    <section id="experience" className="experience-section">
      <div className="experience-container">
        <div className="experience-title-wrapper">
          <h2 className="experience-title">Experience</h2>
          <div className="experience-divider"></div>
        </div>

        <div className="experience-timeline">
          <div className="experience-line" aria-hidden="true"></div>

          {experiences.map((experience) => {
            const Icon = experience.icon;

            return (
              <article
                key={experience.id}
                className={`experience-item experience-item-${experience.side}`}
              >
                <div className="experience-card">
                  <span className="experience-card-lens" aria-hidden="true" />
                  <div className="experience-card-content" data-liquid-ignore>
                    <span className="experience-period">{experience.period}</span>
                    <h3 className="experience-role">{experience.title}</h3>
                    <p className="experience-company">{experience.company}</p>
                  </div>
                </div>

                <div className={`experience-node experience-node-${experience.tone}`}>
                  <span className="experience-node-lens" aria-hidden="true" />
                  <Icon size={21} strokeWidth={2.2} data-liquid-ignore />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
