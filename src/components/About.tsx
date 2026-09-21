import Image from "next/image";
import SkillsRow from "./SkillsRow";

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
          Security Researcher at Microsoft with 6.8+ years across threat
          hunting, detection engineering, cloud security, and incident
          response. Expert in Microsoft Defender (M365D, XDR) and frameworks
          like MITRE ATT&amp;CK, D3FEND, and SHIELD Active Defense. Builds
          detection rules, ASR configurations, and automation workflows in
          Python, KQL, and Power FX across Azure Sentinel, Splunk, ELK, and
          Carbon Black.
        </p>

        <h3 className="mb-4 mt-10 text-xs font-semibold uppercase tracking-widest text-muted">
          Skills
        </h3>
        <SkillsRow />
      </div>
    </div>
  );
}
