import GlitchText from "./GlitchText";

const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/abhishek-singh-26061997/",
  },
  { label: "Topmate", href: "https://topmate.io/abhishekrajawat" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-12 sm:px-10">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-2xl font-semibold tracking-tight">
            <GlitchText text="Abhishek Singh" />
          </p>
          <p className="mt-2 text-sm text-muted">
            &copy; {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>

        <nav className="flex flex-wrap gap-6 text-sm font-medium uppercase tracking-wide text-foreground/80">
          {SOCIAL_LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-accent"
            >
              <GlitchText text={link.label} startDelay={i * 150} />
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
