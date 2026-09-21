import Hero from "@/components/Hero";
import RevealSection from "@/components/RevealSection";

const PROJECTS = [
  { title: "Project One", tag: "Web App" },
  { title: "Project Two", tag: "Open Source" },
  { title: "Project Three", tag: "Design" },
  { title: "Project Four", tag: "API" },
];

export default function Home() {
  return (
    <>
      <Hero />

      <RevealSection className="mx-auto max-w-3xl px-6 py-32 text-center sm:px-10">
        <p className="text-2xl font-medium leading-relaxed text-foreground/90 sm:text-3xl">
          Placeholder mission statement — a short line about what you build
          and why, styled the way landonorris.com uses a single centered
          quote between sections.
        </p>
      </RevealSection>

      <section className="px-6 pb-32 sm:px-10">
        <RevealSection>
          <h2 className="mb-10 text-sm font-semibold uppercase tracking-[0.3em] text-muted">
            Selected Work
          </h2>
        </RevealSection>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PROJECTS.map((project) => (
            <RevealSection key={project.title}>
              <div className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-950">
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <span className="text-xs font-medium uppercase tracking-widest text-accent">
                    {project.tag}
                  </span>
                  <h3 className="mt-1 text-2xl font-semibold transition-transform duration-300 group-hover:translate-x-1">
                    {project.title}
                  </h3>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      <RevealSection
        id="contact"
        className="border-t border-white/10 px-6 py-32 text-center sm:px-10"
      >
        <h2 className="text-4xl font-semibold tracking-tight sm:text-6xl">
          Let&apos;s build something.
        </h2>
        <a
          href="mailto:hello@example.com"
          className="mt-6 inline-block text-lg font-medium text-accent underline underline-offset-4"
        >
          hello@example.com
        </a>
      </RevealSection>
    </>
  );
}
