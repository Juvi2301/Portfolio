export default function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div className="container contact-container">
        <div className="contact-main">
          {/* Left Column: Text & CTA */}
          <div className="contact-left" data-liquid-ignore>
            <div className="contact-subtitle-wrapper">
              <span className="contact-subtitle">Get in Touch</span>
              <div className="contact-divider"></div>
            </div>
            <h2 className="contact-title">
              Let&apos;s Talk<br />
              For your<br />
              <span className="text-blue">Next Projects</span>
            </h2>
            <p className="contact-text">
              Contact for Full-stack development, API architecture, and modern web solutions.
            </p>
            <button className="contact-send-btn">
              <span className="contact-send-btn-lens" aria-hidden="true" />
              <span className="contact-send-btn-label" data-liquid-ignore>
                Send Message <span className="arrow">▸</span>
              </span>
            </button>
          </div>

          {/* Right Column: Form */}
          <div className="contact-right">
            <form className="contact-form">
              <span className="contact-form-lens" aria-hidden="true" />
              <div className="contact-form-content" data-liquid-ignore>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name <span className="required">*</span></label>
                    <input type="text" id="fullName" placeholder="Nathanael Kingston" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address <span className="required">*</span></label>
                    <input type="email" id="email" placeholder="support@gmail.com" />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject <span className="required">*</span></label>
                  <input type="text" id="subject" placeholder="I would like to disscued" />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message <span className="required">*</span></label>
                  <textarea id="message" placeholder="Write message..." rows={4}></textarea>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
