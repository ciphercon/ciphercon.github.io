import GlitchText from "./GlitchText";
import CertificationOrbit from "./CertificationOrbit";
import { CERTIFICATIONS } from "@/data/certifications";

const EDUCATION = [
  {
    school: "IIT Guwahati (E&ICT Academy)",
    program: "Post Graduation Advance Certification, Cyber Security",
    detail: "Aug 2024 – Sep 2025 · Malware Analysis, Applied Cryptography, AI for Cyber Security",
  },
  {
    school: "Lovely Professional University",
    program: "B.Tech, Computer Science and Engineering",
    detail: "2015 – 2019 · Cyber Security",
  },
];

export default function Education() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
            <GlitchText text="Education" />
          </h3>
          <ul className="space-y-4">
            {EDUCATION.map((item, i) => (
              <li key={item.school}>
                <p className="font-semibold">
                  <GlitchText
                    text={item.program}
                    startDelay={i * 150}
                    tickMs={25}
                    lockEvery={2}
                    charsPerTick={2}
                  />
                </p>
                <p className="text-sm text-foreground/60">
                  <GlitchText
                    text={`${item.school} · ${item.detail}`}
                    startDelay={i * 150 + 200}
                    tickMs={20}
                    lockEvery={1}
                    charsPerTick={2}
                  />
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile: simple scrollable list */}
        <div className="md:hidden">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
            <GlitchText text={`Certifications (${CERTIFICATIONS.length})`} />
          </h3>
          <ul
            className="max-h-80 space-y-3 overflow-y-auto pr-2"
            data-lenis-prevent
          >
            {CERTIFICATIONS.map((cert, i) => (
              <li key={`${cert.title}-${cert.date}`} className="text-sm">
                <p className="text-foreground/80">
                  <GlitchText
                    text={cert.title}
                    startDelay={i * 40}
                    tickMs={20}
                    lockEvery={1}
                    charsPerTick={2}
                  />
                </p>
                <p className="text-xs text-muted">
                  <GlitchText
                    text={`${cert.issuer} · ${cert.date}`}
                    startDelay={i * 40 + 100}
                    tickMs={20}
                    lockEvery={1}
                    charsPerTick={2}
                  />
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tablet/desktop: orbit */}
      <div className="mt-16 hidden md:block">
        <h3 className="mb-8 text-center text-xs font-semibold uppercase tracking-widest text-muted">
          <GlitchText text={`Certifications (${CERTIFICATIONS.length}) — click a node`} />
        </h3>
        <CertificationOrbit />
      </div>
    </div>
  );
}
