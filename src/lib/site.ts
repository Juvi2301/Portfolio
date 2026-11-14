// Central site config: SEO (metadata, sitemap, robots, OG images) and every
// contact channel the page links to. Change a value here, not in a component.
export const siteConfig = {
  name: "Pritheeve",
  fullName: "Thayalan Pritheeve",
  title: "Pritheeve | Full Stack & MERN Stack Developer",
  description:
    "Pritheeve (Thayalan Pritheeve) is a Full Stack and MERN Stack Developer building modern web applications with React, Node.js, Express, and MongoDB.",
  url: "https://pritheeve.vercel.app",
  email: "thayalanpritheeve@gmail.com",
  keywords: [
    "Pritheeve",
    "Thayalan Pritheeve",
    "Full Stack Developer",
    "MERN Stack Developer",
    "MERN Developer",
    "React Developer",
    "Node.js Developer",
    "Software Engineer",
    "Web Developer",
    "Portfolio",
  ],
  socials: {
    github: "https://github.com/Juvi2301",
    linkedin: "https://www.linkedin.com/in/thayalan-pritheeve",
    instagram: "https://www.instagram.com/stylish_juvi/",
  },
  // Number as listed in the footer before the redesign. Confirm it is the
  // WhatsApp number before launch: the WhatsApp links below are built from it.
  phone: {
    display: "+94 77 378 0900",
    e164: "+94773780900",
    whatsapp: "94773780900",
  },
  whatsappGreeting: "Hi Pritheeve, I saw your portfolio and would like to talk about a project.",
  // Set `file` to a PDF in /public (for example "/Thayalan-Pritheeve-CV.pdf")
  // to turn on the View and Download buttons. While it is null the Resume
  // section offers "Request my CV" by email and WhatsApp instead.
  resume: {
    file: null as string | null,
    downloadName: "Thayalan-Pritheeve-CV.pdf",
  },
} as const;

export function whatsappLink(message: string = siteConfig.whatsappGreeting) {
  return `https://wa.me/${siteConfig.phone.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function mailtoLink(subject: string, body?: string) {
  const params = [`subject=${encodeURIComponent(subject)}`];
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${siteConfig.email}?${params.join("&")}`;
}
