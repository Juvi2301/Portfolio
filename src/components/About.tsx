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
            <div className="stat-number">2+</div>
            <div className="stat-badge stat-badge-outline">Years Of Experience</div>
          </div>
          
          <div className="stat-group">
            <div className="stat-number">2+</div>
            <div className="stat-badge stat-badge-filled">Project Complete</div>
          </div>
        </div>

        {/* Right Side: Text Card */}
        <div className="about-right">
          <div className="about-card">
            <p className="about-text">
              I am a Software Engineer with an HNDIT background in Information Technology. I completed my internship at Yarl Ventures from August 2025 to February 2026, where I gained practical experience in real-world software development, teamwork, and full-stack application development.
            </p>
            <p className="about-text">
              Currently, I am working as an Associate Software Engineer at Yarl Ventures, focusing on building full-stack web applications, developing APIs, improving user interfaces, and strengthening my skills in frontend and backend technologies.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
