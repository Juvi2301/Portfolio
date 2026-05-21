import { ChevronUp, Mail } from "lucide-react";

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" data-liquid-ignore>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0-.1-3.8s-1.1-.3-3.8 1.5a13.9 13.9 0 0 0-7 0C4.3 1.5 3.2 1.8 3.2 1.8a5.5 5.5 0 0 0-.1 3.8A5.5 5.5 0 0 0 1.5 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" data-liquid-ignore>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" data-liquid-ignore>
    <path d="M22 4.5c-.7.3-1.5.5-2.3.6.8-.5 1.4-1.2 1.7-2.1-.8.5-1.6.8-2.5 1A4 4 0 0 0 12 7.6c0 .3 0 .6.1.9A11.3 11.3 0 0 1 3.8 4.3a4 4 0 0 0 1.2 5.4c-.6 0-1.2-.2-1.8-.5v.1a4 4 0 0 0 3.2 3.9c-.3.1-.7.1-1.1.1-.3 0-.5 0-.8-.1a4 4 0 0 0 3.7 2.8A8 8 0 0 1 2 17.7 11.3 11.3 0 0 0 8.1 19.5c7.3 0 11.3-6.1 11.3-11.3v-.5c.8-.6 1.4-1.3 1.9-2.1z" />
  </svg>
);

export default function ContactFooter() {
  return (
    <section id="contact" className="contact-footer-section">
      <div className="contact-footer-shell">
        <span className="contact-footer-lens" aria-hidden="true" />

        <div className="contact-footer-content" data-liquid-ignore>
          <div className="contact-footer-main">
            <h2 className="contact-footer-title">Let&apos;s Work Together</h2>
            <p className="contact-footer-text">
              I&apos;m currently available for freelance work or new opportunities. If you have a
              project that needs some creative coding, I&apos;d love to hear about it.
            </p>
            <a href="mailto:hello@example.com" className="contact-footer-cta">
              <span className="contact-footer-cta-lens" aria-hidden="true" />
              <span className="contact-footer-cta-label" data-liquid-ignore>
                <Mail size={14} strokeWidth={2.2} />
                Get in Touch
              </span>
            </a>
          </div>

          <a href="#" className="contact-footer-top" aria-label="Back to top">
            <span className="contact-footer-top-lens" aria-hidden="true" />
            <ChevronUp size={27} strokeWidth={2.7} data-liquid-ignore />
          </a>

          <div className="contact-footer-bottom">
            <p className="contact-footer-copy">© 2023 Pritheeve. All rights reserved.</p>
            <div className="contact-footer-socials" aria-label="Social links">
              <a href="#" className="contact-footer-social" aria-label="GitHub">
                <span className="contact-footer-social-lens" aria-hidden="true" />
                <GithubIcon />
              </a>
              <a href="#" className="contact-footer-social" aria-label="LinkedIn">
                <span className="contact-footer-social-lens" aria-hidden="true" />
                <LinkedinIcon />
              </a>
              <a href="#" className="contact-footer-social" aria-label="Twitter">
                <span className="contact-footer-social-lens" aria-hidden="true" />
                <TwitterIcon />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
