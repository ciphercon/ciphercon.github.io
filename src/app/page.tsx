import Hero from "@/components/Hero";
import RevealSection from "@/components/RevealSection";
import About from "@/components/About";
import ProjectGrid from "@/components/ProjectGrid";
import ExperienceAccordion from "@/components/ExperienceAccordion";
import Education from "@/components/Education";

export default function Home() {
  return (
    <>
      <Hero />

      <RevealSection
        id="about"
        className="mx-auto max-w-4xl px-6 py-24 sm:px-10"
      >
        <h2 className="mb-8 text-sm font-semibold uppercase tracking-[0.3em] text-muted">
          About
        </h2>
        <About />
      </RevealSection>

      <section id="work" className="px-6 py-24 sm:px-10">
        <RevealSection>
          <h2 className="mb-10 text-sm font-semibold uppercase tracking-[0.3em] text-muted">
            Highlights
          </h2>
        </RevealSection>
        <RevealSection>
          <ProjectGrid />
        </RevealSection>
      </section>

      <section className="px-6 py-24 sm:px-10">
        <RevealSection>
          <h2 className="mb-10 text-sm font-semibold uppercase tracking-[0.3em] text-muted">
            Worked At
          </h2>
        </RevealSection>
        <RevealSection>
          <ExperienceAccordion />
        </RevealSection>
      </section>

      <section className="px-6 py-24 sm:px-10">
        <RevealSection>
          <Education />
        </RevealSection>
      </section>

      <RevealSection
        id="contact"
        className="border-t border-white/10 px-6 py-32 text-center sm:px-10"
      >
        <h2 className="text-4xl font-semibold tracking-tight sm:text-6xl">
          Let&apos;s talk security.
        </h2>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="mailto:abhisinghr98@gmail.com"
            className="text-lg font-medium text-accent underline underline-offset-4"
          >
            abhisinghr98@gmail.com
          </a>
          <span className="hidden text-muted sm:inline">·</span>
          <a
            href="https://topmate.io/abhishekrajawat"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-medium text-foreground/80 underline underline-offset-4 transition-colors hover:text-accent"
          >
            Book a 1:1
          </a>
          <span className="hidden text-muted sm:inline">·</span>
          <a
            href="/cv.pdf"
            className="text-lg font-medium text-foreground/80 underline underline-offset-4 transition-colors hover:text-accent"
          >
            Download CV
          </a>
        </div>
      </RevealSection>
    </>
  );
}
