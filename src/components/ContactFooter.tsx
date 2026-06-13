import { ChevronUp, Mail } from "lucide-react";

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0-.1-3.8s-1.1-.3-3.8 1.5a13.9 13.9 0 0 0-7 0C4.3 1.5 3.2 1.8 3.2 1.8a5.5 5.5 0 0 0-.1 3.8A5.5 5.5 0 0 0 1.5 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4.5c-.7.3-1.5.5-2.3.6.8-.5 1.4-1.2 1.7-2.1-.8.5-1.6.8-2.5 1A4 4 0 0 0 12 7.6c0 .3 0 .6.1.9A11.3 11.3 0 0 1 3.8 4.3a4 4 0 0 0 1.2 5.4c-.6 0-1.2-.2-1.8-.5v.1a4 4 0 0 0 3.2 3.9c-.3.1-.7.1-1.1.1-.3 0-.5 0-.8-.1a4 4 0 0 0 3.7 2.8A8 8 0 0 1 2 17.7 11.3 11.3 0 0 0 8.1 19.5c7.3 0 11.3-6.1 11.3-11.3v-.5c.8-.6 1.4-1.3 1.9-2.1z" />
  </svg>
);

export default function ContactFooter() {
  return (
    <section id="contact" className="contact-footer-section">
      <div className="contact-footer-shell">
        <div className="contact-footer-content">
          <div className="footer-grid">
            {/* Column 1: Profile */}
            <div className="footer-col-profile">
              <img src="/pritheeve-logo.png" alt="Pritheeve Logo" className="footer-logo" />
              <p className="footer-bio">
                Higher National Diploma in Information Technology at SLIATE
              </p>
              <div className="contact-footer-socials" aria-label="Social links">
                <a href="https://github.com/Juvi2301" target="_blank" rel="noopener noreferrer" className="contact-footer-social" aria-label="GitHub">
                  <GithubIcon />
                </a>
                <a href="https://www.linkedin.com/in/thayalan-pritheeve" target="_blank" rel="noopener noreferrer" className="contact-footer-social" aria-label="LinkedIn">
                  <LinkedinIcon />
                </a>
                <a href="#" className="contact-footer-social" aria-label="Twitter">
                  <TwitterIcon />
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="footer-col-links">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li><a href="#about">About</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#technical-skills">Skills</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>

            {/* Column 3: Get In Touch */}
            <div className="footer-col-contact">
              <h4 className="footer-heading">Get In Touch</h4>
              <ul className="footer-contact-info">
                <li><a href="mailto:thayalanpritheeve@gmail.com">thayalanpritheeve@gmail.com</a></li>
                <li><a href="tel:+94773780900">+94 77 378 0900</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-divider"></div>

          <div className="footer-bottom-bar">
            <p className="footer-copyright">© 2026 Pritheeve. All rights reserved.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
