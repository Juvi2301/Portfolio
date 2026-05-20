import LiquidGlassBadge from "./LiquidGlassBadge";

function StatNumber({ id, value }: { id: string; value: string }) {
  const filterId = `${id}-liquid-glass`;
  const bodyGradientId = `${id}-body`;
  const rimGradientId = `${id}-rim`;
  const lowerRimGradientId = `${id}-lower-rim`;

  return (
    <svg className="stat-number" viewBox="0 0 168 104" role="img" aria-label={value}>
      <defs>
        <filter id={filterId} x="-18%" y="-22%" width="136%" height="150%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.018 0.05"
            numOctaves="2"
            seed="8"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2.2"
            xChannelSelector="R"
            yChannelSelector="G"
            result="refracted"
          />
          <feGaussianBlur in="refracted" stdDeviation="0.25" result="softGlass" />
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.25" result="alphaBlur" />
          <feSpecularLighting
            in="alphaBlur"
            surfaceScale="6"
            specularConstant="0.48"
            specularExponent="22"
            lightingColor="#ffffff"
            result="specular"
          >
            <fePointLight x="-80" y="-70" z="120" />
          </feSpecularLighting>
          <feComposite in="specular" in2="SourceAlpha" operator="in" result="specularClip" />
          <feDropShadow
            in="softGlass"
            dx="0"
            dy="8"
            stdDeviation="4"
            floodColor="#000000"
            floodOpacity="0.68"
            result="shadowed"
          />
          <feMerge>
            <feMergeNode in="shadowed" />
            <feMergeNode in="specularClip" />
          </feMerge>
        </filter>

        <linearGradient id={bodyGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.09" />
          <stop offset="27%" stopColor="#ffffff" stopOpacity="0.045" />
          <stop offset="50%" stopColor="#05070b" stopOpacity="0.42" />
          <stop offset="65%" stopColor="#ffffff" stopOpacity="0.055" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.025" />
        </linearGradient>

        <linearGradient id={rimGradientId} x1="94%" y1="0%" x2="5%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.34" />
          <stop offset="13%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="34%" stopColor="#ffffff" stopOpacity="0.025" />
          <stop offset="52%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.045" />
        </linearGradient>

        <linearGradient id={lowerRimGradientId} x1="0%" y1="100%" x2="100%" y2="8%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.55" />
          <stop offset="42%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="72%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      <g className="stat-number-text" filter={`url(#${filterId})`}>
        <text x="8" y="86" fill="#ffffff" fillOpacity="0.12">{value}</text>
        <text x="8" y="86" fill={`url(#${bodyGradientId})`}>{value}</text>
        <text x="8" y="86" fill="none" stroke={`url(#${rimGradientId})`} strokeWidth="3.1">{value}</text>
        <text x="8" y="86" fill="none" stroke={`url(#${lowerRimGradientId})`} strokeWidth="1.8">{value}</text>
        <text x="8" y="86" fill="none" stroke="#ffffff" strokeOpacity="0.045" strokeWidth="5.6">{value}</text>
      </g>
    </svg>
  );
}

export default function About() {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        
        {/* Left Side: Stats */}
        <div className="about-left">
          <div className="about-title-wrapper">
            <h2 className="about-title">About Me</h2>
            <div className="about-divider"></div>
          </div>
          
          <div className="stat-group">
            <StatNumber id="experience-stat" value="2+" />
            <LiquidGlassBadge>Years Of Experience</LiquidGlassBadge>
          </div>
          
          <div className="stat-group">
            <StatNumber id="project-stat" value="5+" />
            <LiquidGlassBadge>Project Complete</LiquidGlassBadge>
          </div>
        </div>

        {/* Right Side: Text Card */}
        <div className="about-right">
          <div className="about-card">
            <span className="about-card-lens" aria-hidden="true" />
            <div className="about-card-content" data-liquid-ignore>
              <p className="about-text">
                I am a Software Engineer with an HNDIT background in Information Technology. I completed my internship at Yarl Ventures from August 2025 to February 2026, where I gained practical experience in real-world software development, teamwork, and full-stack application development.
              </p>
              <p className="about-text">
                Currently, I am working as an Associate Software Engineer at Yarl Ventures, focusing on building full-stack web applications, developing APIs, improving user interfaces, and strengthening my skills in frontend and backend technologies.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
