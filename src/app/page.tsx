import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import TechnicalSkills from "@/components/TechnicalSkills";
import Projects from "@/components/Projects";
import Resume from "@/components/Resume";
import Contact from "@/components/Contact";
import ContactFooter from "@/components/ContactFooter";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <About />
        <TechnicalSkills />
        <Experience />
        <Projects />
        <Resume />
        <Contact />
      </main>
      <ContactFooter />
    </>
  );
}
