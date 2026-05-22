"use client";

import { Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sections = ["home", "about", "technical-skills", "experience", "projects", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -70% 0px" }
    );

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="nav-wrapper">
      <nav className="nav-container">
        <Link href="#home" className="nav-logo">
          <img src="/pritheeve-logo.png" alt="Pritheeve" className="nav-logo-image" />
        </Link>
        
        <ul className="nav-links">
          <li><Link href="#home" className={activeSection === "home" ? "active" : ""}>Home</Link></li>
          <li><Link href="#about" className={activeSection === "about" ? "active" : ""}>About</Link></li>
          <li><Link href="#technical-skills" className={activeSection === "technical-skills" ? "active" : ""}>Skills</Link></li>
          <li><Link href="#experience" className={activeSection === "experience" ? "active" : ""}>Experience</Link></li>
          <li><Link href="#projects" className={activeSection === "projects" ? "active" : ""}>Projects</Link></li>
        </ul>
        
        <Link href="#contact" className="btn-hire">
          Hire me <Play size={10} fill="currentColor" style={{ marginLeft: '4px' }} />
        </Link>
      </nav>
    </div>
  );
}
