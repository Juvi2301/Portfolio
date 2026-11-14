import { Download, FileText, Mail, MessageCircle } from "lucide-react";
import { mailtoLink, siteConfig, whatsappLink } from "@/lib/site";
import SectionHeader from "./SectionHeader";

// With a PDF configured in siteConfig.resume.file this offers View and
// Download. Without one it offers a real request by email or WhatsApp, so no
// button on the page points at a file that does not exist.
export default function Resume() {
  const file = siteConfig.resume.file;

  return (
    <section id="resume" className="section resume" aria-labelledby="resume-title">
      <div className="section-inner">
        <div className="resume-band glass reveal" data-glass="panel">
          <span className="resume-mark" aria-hidden="true">
            <FileText size={26} strokeWidth={1.6} />
          </span>

          <SectionHeader
            index="05"
            label="Resume"
            titleId="resume-title"
            align="center"
            title={file ? "Download my CV." : "Request my CV."}
            lede={
              file
                ? "Experience, education and skills on one page, as a PDF."
                : "Experience, education and skills on one page. Ask by email or WhatsApp and I will send the PDF."
            }
          />

          <div className="resume-actions">
            {file ? (
              <>
                <a className="btn btn-primary" href={file} download={siteConfig.resume.downloadName}>
                  <Download size={17} aria-hidden="true" />
                  Download CV
                </a>
                <a className="btn btn-secondary" href={file} target="_blank" rel="noopener noreferrer">
                  <FileText size={17} aria-hidden="true" />
                  View resume
                </a>
              </>
            ) : (
              <>
                <a className="btn btn-primary" href={mailtoLink("CV request", "Hi Pritheeve, could you send me your CV?")}>
                  <Mail size={17} aria-hidden="true" />
                  Request CV by email
                </a>
                <a
                  className="btn btn-secondary"
                  href={whatsappLink("Hi Pritheeve, could you send me your CV?")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle size={17} aria-hidden="true" />
                  Ask on WhatsApp
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
