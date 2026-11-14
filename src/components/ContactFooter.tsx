import Image from "next/image";
import { ArrowUp, MessageCircle } from "lucide-react";
import { siteConfig, whatsappLink } from "@/lib/site";

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0-.1-3.8s-1.1-.3-3.8 1.5a13.9 13.9 0 0 0-7 0C4.3 1.5 3.2 1.8 3.2 1.8a5.5 5.5 0 0 0-.1 3.8A5.5 5.5 0 0 0 1.5 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const SOCIALS = [
  { label: "GitHub", href: siteConfig.socials.github, Icon: GithubIcon },
  { label: "LinkedIn", href: siteConfig.socials.linkedin, Icon: LinkedinIcon },
  { label: "Instagram", href: siteConfig.socials.instagram, Icon: InstagramIcon },
];

const QUICK_LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#technical-skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Resume", href: "#resume" },
  { label: "Contact", href: "#contact" },
];

export default function ContactFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" aria-label="Site footer">
      <div className="footer-shell glass">
        <div className="footer-grid">
          <div className="footer-profile">
            <Image
              src="/pritheeve-logo.png"
              alt="Pritheeve"
              width={878}
              height={96}
              sizes="220px"
              className="footer-logo"
            />
            <p className="footer-bio">Higher National Diploma in Information Technology at SLIATE</p>
            <ul className="footer-socials" aria-label="Social links">
              {SOCIALS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a className="footer-social glass" data-glass="orb" href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                    <Icon />
                  </a>
                </li>
              ))}
              <li>
                <a
                  className="footer-social glass"
                  data-glass="orb"
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                >
                  <MessageCircle size={16} aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>

          <nav className="footer-col" aria-labelledby="footer-links-title">
            <h2 className="footer-heading" id="footer-links-title">
              Quick links
            </h2>
            <ul className="footer-links">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-col">
            <h2 className="footer-heading">Get in touch</h2>
            <ul className="footer-links">
              <li>
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              </li>
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                  WhatsApp {siteConfig.phone.display}
                </a>
              </li>
              <li>
                <a href={`tel:${siteConfig.phone.e164}`}>Call {siteConfig.phone.display}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">© {year} Pritheeve. All rights reserved.</p>
          <a className="footer-top" href="#home">
            Back to top
            <ArrowUp size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
