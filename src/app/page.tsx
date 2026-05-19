import { ChevronDown } from "lucide-react";

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0-.1-3.8s-1.1-.3-3.8 1.5a13.9 13.9 0 0 0-7 0C4.3 1.5 3.2 1.8 3.2 1.8a5.5 5.5 0 0 0-.1 3.8A5.5 5.5 0 0 0 1.5 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function Home() {
  return (
    <main className="hero-section">
      <div className="container hero-container">
        
        {/* Circles & Icons Background */}
        <div className="circles-layer">
          <div className="circles-center">
            <div className="circle circle-1"></div>
            <div className="circle circle-2"></div>
            <div className="circle circle-3"></div>
            
            {/* Icons are positioned mathematically relative to circles-center */}
            <a href="#" className="icon-wrapper icon-linkedin" aria-label="LinkedIn">
              <LinkedinIcon />
            </a>
            <a href="#" className="icon-wrapper icon-github" aria-label="GitHub">
              <GithubIcon />
            </a>
            <a href="#" className="icon-wrapper icon-instagram" aria-label="Instagram">
              <InstagramIcon />
            </a>
          </div>
        </div>

        {/* Text Content (Left) */}
        <div className="hero-text-content">
          <div className="hero-divider"></div>
          <h1 className="hero-title">
            I'm Pritheeve, a<br />Software Engineer
          </h1>
          <p className="hero-subtitle">
            Building modern web applications with strong<br />
            focus on frontend and backend development.
          </p>
          <a href="#about" className="btn-down">
            <ChevronDown size={30} strokeWidth={2} />
          </a>
        </div>

        {/* Profile Image (Center) */}
        <div className="hero-image-wrapper">
          <img 
            src="/profile.png" 
            alt="Pritheeve" 
            className="hero-image"
          />
          {/* Bottom fade overlay for seamless blending */}
          <div className="image-fade-bottom"></div>
        </div>

      </div>
    </main>
  );
}
