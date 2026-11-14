"use client";

import { Menu, Play, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "technical-skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
];

// The mobile menu also lists the sections the desktop bar leaves to the
// "Hire me" button and the footer.
const MENU_LINKS = [...NAV_LINKS, { id: "resume", label: "Resume" }, { id: "contact", label: "Contact" }];

const OBSERVED_SECTIONS = ["home", "about", "technical-skills", "experience", "projects", "resume", "contact"];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("home");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -70% 0px" }
    );

    OBSERVED_SECTIONS.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // The mobile menu is a native popover (Escape and outside tap close it).
  // Browsers without the Popover API get the same menu through a class.
  function supportsPopover() {
    return Object.hasOwn(HTMLElement.prototype, "popover");
  }

  function closeMenu() {
    const menu = menuRef.current;
    if (!menu) return;
    if (supportsPopover()) {
      if (menu.matches(":popover-open")) menu.hidePopover();
    } else {
      menu.classList.remove("is-open");
    }
  }

  function onMenuButtonClick() {
    if (!supportsPopover()) menuRef.current?.classList.toggle("is-open");
  }

  return (
    <div className="nav-wrapper">
      <nav className="nav-container" data-glass="nav" aria-label="Main">
        <Link href="#home" className="nav-logo" aria-label="Pritheeve, back to top">
          <Image
            src="/pritheeve-logo.png"
            alt=""
            width={878}
            height={96}
            sizes="(max-width: 640px) 155px, 298px"
            className="nav-logo-image"
            loading="eager"
          />
        </Link>

        <ul className="nav-links">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <Link
                href={`#${link.id}`}
                className={activeSection === link.id ? "active" : ""}
                aria-current={activeSection === link.id ? "true" : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <Link href="#contact" className="btn-hire">
            Hire me <Play size={10} fill="currentColor" style={{ marginLeft: "4px" }} aria-hidden="true" />
          </Link>

          <button
            type="button"
            className="nav-menu-button"
            popoverTarget="nav-menu"
            onClick={onMenuButtonClick}
            aria-label="Menu"
          >
            <Menu className="nav-menu-icon-open" size={20} aria-hidden="true" />
            <X className="nav-menu-icon-close" size={20} aria-hidden="true" />
          </button>
        </div>

        <div id="nav-menu" className="nav-menu" popover="auto" ref={menuRef}>
          <ul>
            {MENU_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className={activeSection === link.id ? "active" : ""}
                  aria-current={activeSection === link.id ? "true" : undefined}
                  onClick={closeMenu}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}
