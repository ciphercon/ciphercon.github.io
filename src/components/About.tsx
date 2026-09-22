import Image from "next/image";
import SkillsRow from "./SkillsRow";
import GlitchText from "./GlitchText";

export default function About() {
  return (
    <div className="grid grid-cols-1 gap-10 sm:grid-cols-[auto_1fr] sm:items-start">
      <Image
        src="/profile.jpg"
        alt="Abhishek Singh"
        width={160}
        height={160}
        className="h-40 w-40 rounded-full object-cover grayscale"
        priority
      />

      <div>
        <p className="max-w-xl text-base text-foreground/70">
          <GlitchText
            text="Security Researcher at Microsoft with 6.8+ years across threat hunting, detection engineering, cloud security, and incident response. Expert in Microsoft Defender (M365D, XDR) and frameworks like MITRE ATT&CK, D3FEND, and SHIELD Active Defense. Builds detection rules, ASR configurations, and automation workflows in Python, KQL, and Power FX across Azure Sentinel, Splunk, ELK, and Carbon Black."
            tickMs={18}
            lockEvery={1}
            charsPerTick={3}
          />
        </p>

        <h3 className="mb-4 mt-10 text-xs font-semibold uppercase tracking-widest text-muted">
          <GlitchText text="Skills" />
        </h3>
        <SkillsRow />
      </div>
    </div>
  );
}
