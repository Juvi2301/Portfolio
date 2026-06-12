"use client";

import { useEffect, useRef, useState } from "react";
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
  const sectionRef = useRef<HTMLElement>(null);
  const [grown, setGrown] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGrown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="experience" className="experience-section" ref={sectionRef}>
      <div className="experience-container">
        <div className="experience-title-wrapper">
          <h2 className="experience-title">Experience</h2>
          <div className="experience-divider"></div>
        </div>

        <div className={`experience-timeline${grown ? " is-grown" : ""}`}>
          <div className="experience-line" aria-hidden="true"></div>

          {experiences.map((experience) => {
            const Icon = experience.icon;

            return (
              <article
                key={experience.id}
                className={`experience-item experience-item-${experience.side}`}
              >
                <div className="experience-card">
                  <div className="experience-card-content">
                    <span className="experience-period">{experience.period}</span>
                    <h3 className="experience-role">{experience.title}</h3>
                    <p className="experience-company">{experience.company}</p>
                  </div>
                </div>

                <div className={`experience-node experience-node-${experience.tone}`}>
                  <Icon size={21} strokeWidth={2.2} />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
